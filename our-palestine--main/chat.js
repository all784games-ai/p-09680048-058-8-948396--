(() => {
    const script = document.createElement('script');
    script.src = new URL('site.js', document.currentScript.src).href;
    script.onerror = () => console.error(`Could not load shared site behavior: ${script.src}`);
    document.head.appendChild(script);

    const keys = {
        rooms: 'ourPalestineChatRooms',
        messages: 'ourPalestineChatMessages',
        friends: 'ourPalestineChatFriends',
        session: 'ourPalestineSession',
        accounts: 'ourPalestineAccounts'
    };
    const seededRooms = [
        { id: 'public-general', type: 'public', name: 'Community lounge', description: 'Meet neighbors and say hello.', members: [], admins: [] },
        { id: 'public-trading', type: 'public', name: 'Trading & marketplace', description: 'Talk about local trade, makers, and listings.', members: [], admins: [] },
        { id: 'public-games', type: 'public', name: 'Games & play', description: 'Find players and talk about games.', members: [], admins: [] },
        { id: 'public-news', type: 'public', name: 'News & current events', description: 'Discuss community news and what is happening.', members: [], admins: [] }
    ];
    const status = document.getElementById('chat-status');
    const roomTitle = document.getElementById('room-title');
    const roomType = document.getElementById('room-type');
    const roomDescription = document.getElementById('room-description');
    const messageList = document.getElementById('message-list');
    const messageForm = document.getElementById('message-form');
    const emptyMessages = document.getElementById('empty-messages');
    const memberSummary = document.getElementById('member-summary');
    const editGroupButton = document.getElementById('edit-group');
    const groupDialog = document.getElementById('group-dialog');
    const groupForm = document.getElementById('group-form');
    const groupMembers = document.getElementById('group-members');
    const friendSelect = document.getElementById('friend-select');
    const friendList = document.getElementById('friend-list');
    let activeRoomId = '';
    let session;
    let userId;
    let rooms = [];
    let messages = [];
    let friends = [];
    let accounts = [];
    let editingGroupId = '';

    function showStatus(text, isError = false) {
        status.textContent = text;
        status.classList.toggle('is-error', isError);
    }

    function readList(key, fallback) {
        const saved = localStorage.getItem(key);
        if (saved === null) {
            return fallback;
        }
        const value = JSON.parse(saved);
        if (!Array.isArray(value)) {
            throw new Error(`Saved chat data for ${key} is not a list.`);
        }
        return value;
    }

    function save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getAccountId(account) {
        return `member:${account.email}`;
    }

    function accountName(id) {
        if (id === userId) return session.name;
        const account = accounts.find((item) => getAccountId(item) === id);
        return account ? account.name : 'Member';
    }

    function roomName(room) {
        if (room.type === 'private') {
            const otherMember = room.members.find((id) => id !== userId);
            return otherMember ? accountName(otherMember) : room.name;
        }
        return room.name;
    }

    function isMember(room) {
        return room.type === 'public' || room.members.includes(userId) || (room.type === 'group' && session.admin === true);
    }

    function canEdit(room) {
        return room.type === 'group' && (session.admin === true || room.admins.includes(userId));
    }

    function listButton(room, container) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'room-button';
        button.classList.toggle('is-active', room.id === activeRoomId);
        const title = document.createElement('strong');
        title.textContent = roomName(room);
        const description = document.createElement('span');
        description.textContent = room.type === 'public' ? room.description : room.type === 'group' ? `${room.members.length} members` : 'Private conversation';
        button.append(title, description);
        button.addEventListener('click', () => selectRoom(room.id));
        container.appendChild(button);
    }

    function renderRoomList(container, list, emptyText) {
        container.replaceChildren();
        if (list.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'sidebar-empty';
            empty.textContent = emptyText;
            container.appendChild(empty);
            return;
        }
        list.forEach((room) => listButton(room, container));
    }

    function renderFriends() {
        friendList.replaceChildren();
        if (friends.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'sidebar-empty';
            empty.textContent = 'No friends added yet.';
            friendList.appendChild(empty);
        }
        friends.forEach((friendId) => {
            const item = document.createElement('li');
            const name = document.createElement('span');
            name.textContent = accountName(friendId);
            const actions = document.createElement('span');
            const messageButton = document.createElement('button');
            messageButton.type = 'button';
            messageButton.textContent = 'Message';
            messageButton.addEventListener('click', () => openPrivateChat(friendId));
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                friends = friends.filter((id) => id !== friendId);
                try {
                    save(friendsKey(), friends);
                    render();
                    showStatus('Friend removed.');
                } catch (error) {
                    console.error('Could not update your friends list.', error);
                    showStatus('Your friends list could not be updated. Check browser storage and try again.', true);
                }
            });
            actions.append(messageButton, removeButton);
            item.append(name, actions);
            friendList.appendChild(item);
        });
    }

    function friendsKey() {
        return `${keys.friends}:${encodeURIComponent(userId)}`;
    }

    function privateRoomId(friendId) {
        return `private:${[userId, friendId].sort().map(encodeURIComponent).join(':')}`;
    }

    function getVisibleRooms() {
        return rooms.filter(isMember);
    }

    function renderMessages(room) {
        const roomMessages = messages.filter((message) => message.roomId === room.id);
        messageList.replaceChildren();
        roomMessages.slice(-150).forEach((message) => {
            const item = document.createElement('li');
            item.className = 'message-item';
            item.classList.toggle('is-mine', message.senderId === userId);
            const meta = document.createElement('div');
            meta.className = 'message-meta';
            const sender = document.createElement('strong');
            sender.textContent = message.anonymous ? 'Anonymous' : message.senderName;
            const time = document.createElement('time');
            time.dateTime = message.timestamp;
            const date = new Date(message.timestamp);
            time.textContent = Number.isNaN(date.getTime()) ? '' : date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
            meta.append(sender, time);
            const text = document.createElement('p');
            text.className = 'message-text';
            text.textContent = message.text;
            item.append(meta, text);
            messageList.appendChild(item);
        });
        emptyMessages.hidden = roomMessages.length > 0;
        emptyMessages.textContent = room.type === 'public' ? 'No messages yet. Start the conversation.' : 'This private chat is ready. Send a message to get started.';
        messageList.hidden = roomMessages.length === 0;
        messageForm.hidden = false;
        messageList.scrollTop = messageList.scrollHeight;
    }

    function selectRoom(roomId) {
        const room = getVisibleRooms().find((item) => item.id === roomId);
        if (!room) {
            showStatus('This conversation is not available to your account.', true);
            return;
        }
        activeRoomId = room.id;
        roomTitle.textContent = roomName(room);
        roomType.textContent = room.type === 'public' ? 'Public room' : room.type === 'private' ? 'Private chat' : 'Private group';
        roomDescription.textContent = room.description || '';
        editGroupButton.hidden = !canEdit(room);
        if (room.type === 'public') {
            memberSummary.hidden = true;
        } else {
            const names = room.members.map(accountName);
            memberSummary.textContent = `Members: ${names.join(', ')}`;
            memberSummary.hidden = false;
        }
        renderMessages(room);
        render();
    }

    function render() {
        const visible = getVisibleRooms();
        renderRoomList(document.getElementById('public-rooms'), visible.filter((room) => room.type === 'public'), 'No public rooms.');
        renderRoomList(document.getElementById('private-rooms'), visible.filter((room) => room.type === 'private'), 'Add a friend to start a private chat.');
        renderRoomList(document.getElementById('group-rooms'), visible.filter((room) => room.type === 'group'), 'Create or join a group.');
        renderFriends();
        updateAccountOptions();
        document.querySelectorAll('.room-button').forEach((button) => {
            const room = visible.find((item) => item.name === button.querySelector('strong').textContent && item.id === activeRoomId);
            button.classList.toggle('is-active', Boolean(room));
        });
    }

    function updateAccountOptions() {
        const available = accounts.filter((account) => account.email && account.email !== session.email && account.blocked !== true);
        function fill(select, selectedIds = []) {
            select.replaceChildren();
            if (select === friendSelect) {
                const placeholder = document.createElement('option');
                placeholder.value = '';
                placeholder.textContent = 'Choose a member';
                placeholder.selected = true;
                select.appendChild(placeholder);
            }
            const options = available.map((account) => ({ id: getAccountId(account), name: account.name }));
            selectedIds.forEach((id) => {
                if (!options.some((option) => option.id === id)) {
                    options.push({ id, name: accountName(id) });
                }
            });
            options.forEach(({ id, name }) => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = name;
                option.selected = selectedIds.includes(id);
                option.disabled = select === friendSelect && friends.includes(id);
                select.appendChild(option);
            });
        }
        fill(friendSelect);
        fill(groupMembers, editingGroupId ? (rooms.find((room) => room.id === editingGroupId)?.members || []).filter((id) => id !== userId) : []);
    }

    function openPrivateChat(friendId) {
        let room = rooms.find((item) => item.id === privateRoomId(friendId));
        if (!room) {
            room = {
                id: privateRoomId(friendId),
                type: 'private',
                name: accountName(friendId),
                description: `A private conversation with ${accountName(friendId)}.`,
                members: [userId, friendId],
                admins: []
            };
            rooms.push(room);
            try {
                save(keys.rooms, rooms);
            } catch (error) {
                console.error('Could not save private chat.', error);
                rooms = rooms.filter((item) => item.id !== room.id);
                showStatus('The private chat could not be saved. Check browser storage and try again.', true);
                return;
            }
        }
        selectRoom(room.id);
    }

    function openGroupDialog(room = null) {
        editingGroupId = room ? room.id : '';
        document.getElementById('group-dialog-title').textContent = room ? 'Edit group' : 'Create a group';
        document.getElementById('group-name').value = room ? room.name : '';
        document.getElementById('group-description-input').value = room ? room.description : '';
        updateAccountOptions();
        const submit = groupForm.querySelector('[type="submit"]');
        submit.textContent = room ? 'Save group' : 'Create group';
        groupDialog.showModal();
    }

    document.getElementById('add-friend-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const friendId = friendSelect.value;
        if (!friendId || friends.includes(friendId)) return;
        friends.push(friendId);
        try {
            save(friendsKey(), friends);
            friendSelect.value = '';
            render();
            showStatus(`${accountName(friendId)} added to your friends.`);
        } catch (error) {
            console.error('Could not add friend.', error);
            friends = friends.filter((id) => id !== friendId);
            showStatus('Your friend could not be added. Check browser storage and try again.', true);
        }
    });

    document.getElementById('new-private-chat').addEventListener('click', () => {
        if (friends.length === 0) {
            showStatus('Add a friend first to start a private chat.');
            friendSelect.focus();
            return;
        }
        openPrivateChat(friends[0]);
    });

    document.getElementById('new-group').addEventListener('click', () => openGroupDialog());
    editGroupButton.addEventListener('click', () => {
        const room = rooms.find((item) => item.id === activeRoomId);
        if (room && canEdit(room)) openGroupDialog(room);
    });

    groupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('group-name').value.trim();
        const description = document.getElementById('group-description-input').value.trim();
        const members = Array.from(groupMembers.selectedOptions, (option) => option.value);
        if (!name) {
            showStatus('Enter a group name.', true);
            return;
        }
        if (editingGroupId) {
            const room = rooms.find((item) => item.id === editingGroupId);
            if (!room || !canEdit(room)) {
                showStatus('Only a group admin can edit this group.', true);
                groupDialog.close();
                return;
            }
            room.name = name;
            room.description = description;
            room.members = Array.from(new Set([...members, ...(room.members.includes(userId) ? [userId] : [])]));
        } else {
            const room = {
                id: `group:${crypto.randomUUID()}`,
                type: 'group',
                name,
                description,
                members: Array.from(new Set([userId, ...members])),
                admins: [userId]
            };
            rooms.push(room);
            activeRoomId = room.id;
        }
        try {
            save(keys.rooms, rooms);
            groupDialog.close();
            render();
            selectRoom(activeRoomId);
            showStatus(editingGroupId ? 'Group details and membership updated.' : 'Group created. You are its admin.');
        } catch (error) {
            console.error('Could not save chat group.', error);
            showStatus('The group could not be saved. Check browser storage and try again.', true);
        }
        editingGroupId = '';
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = document.getElementById('message-input').value.trim();
        const room = rooms.find((item) => item.id === activeRoomId);
        if (!room || !isMember(room) || !text) return;
        const anonymous = document.getElementById('anonymous-mode').checked;
        const message = {
            roomId: room.id,
            text,
            timestamp: new Date().toISOString(),
            anonymous
        };
        if (!anonymous) {
            message.senderId = userId;
            message.senderName = session.name;
        }
        try {
            messages.push(message);
            save(keys.messages, messages);
            document.getElementById('message-input').value = '';
            renderMessages(room);
            showStatus('');
        } catch (error) {
            console.error('Could not save chat message.', error);
            showStatus('Your message could not be saved. Check browser storage and try again.', true);
        }
    });

    document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => groupDialog.close()));

    try {
        session = JSON.parse(localStorage.getItem(keys.session) || 'null');
        if (!session || typeof session.name !== 'string') {
            throw new Error('Your sign-in session could not be loaded.');
        }
        userId = session.email ? `member:${session.email}` : `guest:${session.name}`;
        accounts = readList(keys.accounts, []);
        rooms = readList(keys.rooms, seededRooms);
        messages = readList(keys.messages, []);
        friends = readList(friendsKey(), []);
        if (!rooms.some((room) => room.type === 'public')) {
            rooms = [...seededRooms, ...rooms];
        }
        save(keys.rooms, rooms);
        render();
        const firstPublicRoom = rooms.find((room) => room.type === 'public');
        if (firstPublicRoom) selectRoom(firstPublicRoom.id);
    } catch (error) {
        console.error('Could not initialize community chat.', error);
        showStatus('Chat data could not be loaded. Check browser storage and reload this page.', true);
        messageForm.hidden = true;
    }
})();
