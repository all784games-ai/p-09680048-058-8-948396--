(() => {
    const listingsKey = 'ourPalestineMarketListings';
    const sampleVersionKey = 'ourPalestineMarketSampleVersion';
    const guestSellerKey = 'ourPalestineGuestSellerId';
    const marketText = {
        en: {
            sections: 'Market sections', intro: 'Browse community listings or post something you would like to sell.',
            buy: 'Buy', sell: 'Sell', searchProducts: 'Search products',
            searchPlaceholder: 'Search by name or description', productType: 'Product type',
            allProducts: 'All products', food: 'Food & produce', crafts: 'Arts & crafts',
            clothing: 'Clothing', homeLiving: 'Home & living', books: 'Books & learning',
            services: 'Services', other: 'Other', currency: 'Currency', allCurrencies: 'All currencies',
            sortBy: 'Sort by', newest: 'Newest first', priceLow: 'Price: low to high',
            priceHigh: 'Price: high to low', nameSort: 'Name: A to Z',
            sortNote: 'When viewing all currencies, price sorting groups products by currency; filter to one currency for a direct price comparison.',
            postProduct: 'Post a product for sale', postDescription: 'Add a clear description and price so buyers know what you are offering.',
            productName: 'Product name', price: 'Price', pricePlaceholder: '0.00',
            priceCurrency: 'Price currency', condition: 'Condition', newCondition: 'New',
            likeNew: 'Like new', goodCondition: 'Good', preowned: 'Pre-owned',
            notApplicable: 'Not applicable', description: 'Description',
            descriptionPlaceholder: 'Describe the product, size, pickup details, or service.',
            sellerName: 'Seller name', contactEmail: 'Contact email (optional)',
            storageNote: 'Demo marketplace: listings are saved in this browser only and are not shared online.',
            postListing: 'Post listing', yourListings: 'Your listings',
            sampleListing: 'Sample listing', listedBy: 'Listed by', contactSeller: 'Contact seller',
            removeListing: 'Remove listing', productCountOne: 'product found', productCountMany: 'products found',
            emptyProducts: 'No products match these filters. Try another search or product type.',
            emptyListings: 'You have not posted any products yet.',
            onlyOwnListings: 'You can only remove your own listings.',
            listingRemoved: 'Listing removed.', listingSaved: 'Your product is now listed in the marketplace.',
            invalidPrice: 'Enter a price greater than zero.',
            saveError: 'Your listing could not be saved. Check browser storage and try again.',
            loadError: 'Marketplace listings could not be loaded. Check browser storage and reload.',
            ownLoadError: 'Your listings could not be loaded.',
            categoryValueFood: 'Food & produce', categoryValueCrafts: 'Arts & crafts',
            categoryValueClothing: 'Clothing', categoryValueHome: 'Home & living',
            categoryValueBooks: 'Books & learning', categoryValueServices: 'Services',
            categoryValueOther: 'Other', conditionNew: 'New', conditionLikeNew: 'Like new',
            conditionGood: 'Good', conditionPreowned: 'Pre-owned',
            conditionNA: 'Not applicable',
            demoOliveName: 'Olive oil, family harvest',
            demoOliveDescription: 'Fresh local olive oil in a sealed 1-liter bottle.',
            demoBagName: 'Hand-embroidered tote bag',
            demoBagDescription: 'A reusable cotton tote with traditional-inspired embroidery.',
            demoBookName: 'Palestinian home cooking book',
            demoBookDescription: 'A pre-owned recipe book in good condition.',
            demoPotteryName: 'Handmade ceramic serving bowl',
            demoPotteryDescription: 'A small handmade bowl for serving or display.',
            demoShirtName: 'Traditional embroidered shirt',
            demoShirtDescription: 'A lightly worn embroidered shirt. Please ask about available sizing.',
            demoLessonsName: 'Arabic conversation lessons',
            demoLessonsDescription: 'One-hour online beginner conversation session.',
            demoBasketName: 'Woven storage basket',
            demoBasketDescription: 'A sturdy woven basket for home storage or display.',
            demoSeller: 'Community seller'
        },
        ar: {
            sections: 'أقسام السوق', intro: 'تصفّح عروض المجتمع أو أضف منتجًا ترغب في بيعه.',
            buy: 'شراء', sell: 'بيع', searchProducts: 'البحث عن المنتجات',
            searchPlaceholder: 'ابحث بالاسم أو الوصف', productType: 'نوع المنتج',
            allProducts: 'كل المنتجات', food: 'الأطعمة والمنتجات الزراعية', crafts: 'الفنون والحرف',
            clothing: 'الملابس', homeLiving: 'المنزل والمعيشة', books: 'الكتب والتعلّم',
            services: 'الخدمات', other: 'أخرى', currency: 'العملة', allCurrencies: 'كل العملات',
            sortBy: 'ترتيب حسب', newest: 'الأحدث أولًا', priceLow: 'السعر: من الأقل إلى الأعلى',
            priceHigh: 'السعر: من الأعلى إلى الأقل', nameSort: 'الاسم: أ إلى ي',
            sortNote: 'عند عرض عملات متعددة، تُرتّب الأسعار ضمن مجموعات العملات. اختر عملة واحدة لمقارنة مباشرة.',
            postProduct: 'أضف منتجًا للبيع', postDescription: 'أضف وصفًا واضحًا وسعرًا ليعرف المشترون ما تعرضه.',
            productName: 'اسم المنتج', price: 'السعر', pricePlaceholder: '0.00',
            priceCurrency: 'عملة السعر', condition: 'الحالة', newCondition: 'جديد',
            likeNew: 'كالجديد', goodCondition: 'جيد', preowned: 'مستعمل',
            notApplicable: 'لا ينطبق', description: 'الوصف',
            descriptionPlaceholder: 'صف المنتج أو المقاس أو تفاصيل الاستلام أو الخدمة.',
            sellerName: 'اسم البائع', contactEmail: 'البريد الإلكتروني للتواصل (اختياري)',
            storageNote: 'سوق تجريبي: تُحفظ العروض في هذا المتصفح فقط ولا تتم مشاركتها عبر الإنترنت.',
            postListing: 'نشر العرض', yourListings: 'عروضك',
            sampleListing: 'عرض تجريبي', listedBy: 'البائع', contactSeller: 'تواصل مع البائع',
            removeListing: 'حذف العرض', productCountOne: 'منتج موجود', productCountMany: 'منتجات موجودة',
            emptyProducts: 'لا توجد منتجات تطابق عوامل التصفية. جرّب بحثًا أو نوعًا آخر.',
            emptyListings: 'لم تنشر أي منتجات بعد.',
            onlyOwnListings: 'يمكنك حذف عروضك فقط.',
            listingRemoved: 'تم حذف العرض.', listingSaved: 'تم نشر منتجك في السوق.',
            invalidPrice: 'أدخل سعرًا أكبر من صفر.',
            saveError: 'تعذّر حفظ العرض. تحقق من مساحة التخزين في المتصفح وحاول مجددًا.',
            loadError: 'تعذّر تحميل عروض السوق. تحقق من مساحة التخزين وأعد تحميل الصفحة.',
            ownLoadError: 'تعذّر تحميل عروضك.',
            categoryValueFood: 'الأطعمة والمنتجات الزراعية', categoryValueCrafts: 'الفنون والحرف',
            categoryValueClothing: 'الملابس', categoryValueHome: 'المنزل والمعيشة',
            categoryValueBooks: 'الكتب والتعلّم', categoryValueServices: 'الخدمات',
            categoryValueOther: 'أخرى', conditionNew: 'جديد', conditionLikeNew: 'كالجديد',
            conditionGood: 'جيد', conditionPreowned: 'مستعمل',
            conditionNA: 'لا ينطبق',
            demoOliveName: 'زيت زيتون من محصول عائلي',
            demoOliveDescription: 'زيت زيتون محلي طازج في عبوة محكمة سعة لتر واحد.',
            demoBagName: 'حقيبة قماش مطرزة يدويًا',
            demoBagDescription: 'حقيبة قطنية قابلة لإعادة الاستخدام بتطريز مستوحى من التراث.',
            demoBookName: 'كتاب طبخ فلسطيني منزلي',
            demoBookDescription: 'كتاب وصفات مستعمل بحالة جيدة.',
            demoPotteryName: 'وعاء تقديم خزفي مصنوع يدويًا',
            demoPotteryDescription: 'وعاء صغير مصنوع يدويًا للتقديم أو الزينة.',
            demoShirtName: 'قميص مطرز تقليدي',
            demoShirtDescription: 'قميص مطرز بحالة جيدة. يرجى السؤال عن المقاسات المتوفرة.',
            demoLessonsName: 'دروس محادثة باللغة العربية',
            demoLessonsDescription: 'جلسة محادثة للمبتدئين عبر الإنترنت لمدة ساعة.',
            demoBasketName: 'سلة تخزين منسوجة',
            demoBasketDescription: 'سلة متينة منسوجة للتخزين المنزلي أو للزينة.',
            demoSeller: 'بائع من المجتمع'
        }
    };
    const categoryTranslationKeys = {
        'Food & produce': 'categoryValueFood',
        'Arts & crafts': 'categoryValueCrafts',
        Clothing: 'categoryValueClothing',
        'Home & living': 'categoryValueHome',
        'Books & learning': 'categoryValueBooks',
        Services: 'categoryValueServices',
        Other: 'categoryValueOther'
    };
    const conditionTranslationKeys = {
        New: 'conditionNew',
        'Like new': 'conditionLikeNew',
        Good: 'conditionGood',
        'Pre-owned': 'conditionPreowned',
        'Not applicable': 'conditionNA'
    };
    const demoTranslationKeys = {
        'sample-olive-oil': ['demoOliveName', 'demoOliveDescription'],
        'sample-embroidered-bag': ['demoBagName', 'demoBagDescription'],
        'sample-cookbook': ['demoBookName', 'demoBookDescription'],
        'sample-pottery': ['demoPotteryName', 'demoPotteryDescription'],
        'sample-shirt': ['demoShirtName', 'demoShirtDescription'],
        'sample-language-lessons': ['demoLessonsName', 'demoLessonsDescription'],
        'sample-basket': ['demoBasketName', 'demoBasketDescription']
    };
    const sampleListings = [
        {
            id: 'sample-olive-oil',
            name: 'Olive oil, family harvest',
            category: 'Food & produce',
            price: 45,
            currency: 'ILS',
            condition: 'New',
            description: 'Fresh local olive oil in a sealed 1-liter bottle.',
            seller: 'Community seller',
            contact: '',
            date: '2026-11-05',
            demo: true
        },
        {
            id: 'sample-embroidered-bag',
            name: 'Hand-embroidered tote bag',
            category: 'Arts & crafts',
            price: 30,
            currency: 'ILS',
            condition: 'New',
            description: 'A reusable cotton tote with traditional-inspired embroidery.',
            seller: 'Community seller',
            contact: '',
            date: '2026-11-05',
            demo: true
        },
        {
            id: 'sample-cookbook',
            name: 'Palestinian home cooking book',
            category: 'Books & learning',
            price: 12,
            currency: 'USD',
            condition: 'Good',
            description: 'A pre-owned recipe book in good condition.',
            seller: 'Community seller',
            contact: '',
            date: '2026-11-05',
            demo: true
        },
        {
            id: 'sample-pottery',
            name: 'Handmade ceramic serving bowl',
            category: 'Home & living',
            price: 18,
            currency: 'JOD',
            condition: 'New',
            description: 'A small handmade bowl for serving or display.',
            seller: 'Community seller',
            contact: '',
            date: '2026-11-05',
            demo: true
        },
        {
            id: 'sample-shirt',
            name: 'Traditional embroidered shirt',
            category: 'Clothing',
            price: 60,
            currency: 'ILS',
            condition: 'Like new',
            description: 'A lightly worn embroidered shirt. Please ask about available sizing.',
            seller: 'Community seller',
            contact: '',
            date: '2026-11-05',
            demo: true
        },
        {
            id: 'sample-language-lessons',
            name: 'Arabic conversation lessons',
            category: 'Services',
            price: 15,
            currency: 'USD',
            condition: 'Not applicable',
            description: 'One-hour online beginner conversation session.',
            seller: 'Community seller',
            contact: '',
            date: '2026-11-05',
            demo: true
        },
        {
            id: 'sample-basket',
            name: 'Woven storage basket',
            category: 'Other',
            price: 22,
            currency: 'JOD',
            condition: 'Good',
            description: 'A sturdy woven basket for home storage or display.',
            seller: 'Community seller',
            contact: '',
            date: '2026-11-05',
            demo: true
        }
    ];
    const buyTab = document.getElementById('buy-tab');
    const sellTab = document.getElementById('sell-tab');
    const buyPanel = document.getElementById('buy-panel');
    const sellPanel = document.getElementById('sell-panel');
    const searchInput = document.getElementById('market-search');
    const categoryFilter = document.getElementById('category-filter');
    const currencyFilter = document.getElementById('currency-filter');
    const sortFilter = document.getElementById('sort-filter');
    const productList = document.getElementById('product-list');
    const resultCount = document.getElementById('market-result-count');
    const listingForm = document.getElementById('listing-form');
    const listingMessage = document.getElementById('listing-message');
    const myListings = document.getElementById('my-listings');
    let currentLanguage = new URLSearchParams(window.location.search).get('lang') === 'ar' ? 'ar' : 'en';
    let listingMessageKey = '';

    function text(key) {
        return marketText[currentLanguage][key] || marketText.en[key] || key;
    }

    function translateMarketContent() {
        document.querySelectorAll('[data-market-i18n]').forEach((element) => {
            const key = element.dataset.marketI18n;
            if (marketText[currentLanguage][key]) {
                element.textContent = text(key);
            }
        });
        document.querySelectorAll('[data-market-i18n-placeholder]').forEach((element) => {
            element.placeholder = text(element.dataset.marketI18nPlaceholder);
        });
        document.querySelectorAll('[data-market-i18n-aria-label]').forEach((element) => {
            element.setAttribute('aria-label', text(element.dataset.marketI18nAriaLabel));
        });
        document.documentElement.lang = currentLanguage;
        document.body.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
        listingMessage.textContent = listingMessageKey ? text(listingMessageKey) : '';
        renderMarket();
    }

    function readListings() {
        const savedListings = localStorage.getItem(listingsKey);
        if (!savedListings) {
            localStorage.setItem(listingsKey, JSON.stringify(sampleListings));
            localStorage.setItem(sampleVersionKey, '1');
            return sampleListings;
        }

        const listings = JSON.parse(savedListings);
        const validCategories = new Set(Object.keys(categoryTranslationKeys));
        const validCurrencies = new Set(['ILS', 'USD', 'JOD']);
        if (!Array.isArray(listings) || listings.some((listing) =>
            !listing ||
            typeof listing.id !== 'string' ||
            typeof listing.name !== 'string' ||
            !validCategories.has(listing.category) ||
            !Number.isFinite(listing.price) ||
            !validCurrencies.has(listing.currency) ||
            typeof listing.condition !== 'string' ||
            typeof listing.description !== 'string' ||
            typeof listing.seller !== 'string' ||
            typeof listing.date !== 'string')) {
            throw new Error('Saved marketplace listings have an invalid format.');
        }

        if (localStorage.getItem(sampleVersionKey) !== '1') {
            const existingIds = new Set(listings.map((listing) => listing.id));
            const newSamples = sampleListings.filter((listing) => !existingIds.has(listing.id));
            if (newSamples.length > 0) {
                listings.push(...newSamples);
                localStorage.setItem(listingsKey, JSON.stringify(listings));
            }
            localStorage.setItem(sampleVersionKey, '1');
        }
        return listings;
    }

    function setListingMessage(key = '') {
        listingMessageKey = key;
        listingMessage.textContent = key ? text(key) : '';
    }

    function saveListings(listings) {
        localStorage.setItem(listingsKey, JSON.stringify(listings));
    }

    function getSession() {
        const savedSession = localStorage.getItem('ourPalestineSession');
        if (!savedSession) {
            return {};
        }

        const session = JSON.parse(savedSession);
        if (!session || typeof session !== 'object') {
            throw new Error('Saved account session has an invalid format.');
        }
        return session;
    }

    function getOwnerId(session) {
        if (typeof session.email === 'string' && session.email) {
            return `email:${session.email.toLowerCase()}`;
        }
        let guestId = localStorage.getItem(guestSellerKey);
        if (!guestId) {
            guestId = crypto.randomUUID();
            localStorage.setItem(guestSellerKey, guestId);
        }
        return `guest:${guestId}`;
    }

    function formatPrice(price, currency) {
        const locale = currentLanguage === 'ar' ? 'ar-PS' : 'en';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            maximumFractionDigits: 2
        }).format(price);
    }

    function formatDate(date) {
        const parsedDate = new Date(`${date}T00:00:00`);
        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }
        return new Intl.DateTimeFormat(currentLanguage === 'ar' ? 'ar-PS' : 'en', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(parsedDate);
    }

    function createProductCard(listing, canDelete = false) {
        const card = document.createElement('article');
        card.className = 'product-card';

        const top = document.createElement('div');
        top.className = 'product-card-top';
        const category = document.createElement('span');
        category.className = 'product-category';
        category.textContent = text(categoryTranslationKeys[listing.category] || listing.category);
        const price = document.createElement('span');
        price.className = 'product-price';
        price.textContent = formatPrice(listing.price, listing.currency);
        top.append(category, price);

        const title = document.createElement('h2');
        const demoTranslation = listing.demo ? demoTranslationKeys[listing.id] : null;
        title.textContent = demoTranslation ? text(demoTranslation[0]) : listing.name;
        const description = document.createElement('p');
        description.className = 'product-description';
        description.textContent = demoTranslation ? text(demoTranslation[1]) : listing.description;
        const meta = document.createElement('p');
        meta.className = 'product-meta';
        const listingType = listing.demo ? text('sampleListing') : text(conditionTranslationKeys[listing.condition] || listing.condition);
        const sellerName = listing.demo ? text('demoSeller') : listing.seller;
        meta.textContent = `${listingType} · ${text('listedBy')} ${sellerName} · ${formatDate(listing.date)}`;
        card.append(top, title, description, meta);

        if (listing.contact) {
            const contact = document.createElement('a');
            contact.className = 'product-contact';
            contact.href = `mailto:${encodeURIComponent(listing.contact)}?subject=${encodeURIComponent(`About ${listing.name}`)}`;
            contact.textContent = text('contactSeller');
            card.appendChild(contact);
        }

        if (canDelete) {
            const remove = document.createElement('button');
            remove.className = 'product-delete';
            remove.type = 'button';
            remove.textContent = text('removeListing');
            remove.addEventListener('click', () => removeListing(listing.id));
            card.appendChild(remove);
        }

        return card;
    }

    function getVisibleListings() {
        const query = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;
        const currency = currencyFilter.value;
        const sort = sortFilter.value;
        const listings = readListings().filter((listing) => {
            const demoKeys = listing.demo ? demoTranslationKeys[listing.id] : null;
            const localizedDemoText = demoKeys ? `${text(demoKeys[0])} ${text(demoKeys[1])}` : '';
            const translatedCategory = text(categoryTranslationKeys[listing.category] || listing.category);
            const matchesQuery = !query ||
                listing.name.toLowerCase().includes(query) ||
                listing.description.toLowerCase().includes(query) ||
                listing.category.toLowerCase().includes(query) ||
                localizedDemoText.toLowerCase().includes(query) ||
                translatedCategory.toLowerCase().includes(query);
            return matchesQuery &&
                (category === 'all' || listing.category === category) &&
                (currency === 'all' || listing.currency === currency);
        });

        if (sort === 'price-low' || sort === 'price-high') {
            const direction = sort === 'price-low' ? 1 : -1;
            listings.sort((first, second) => {
                if (first.currency !== second.currency) {
                    return first.currency.localeCompare(second.currency);
                }
                return (first.price - second.price) * direction;
            });
        } else if (sort === 'name') {
            listings.sort((first, second) => first.name.localeCompare(second.name));
        } else {
            listings.sort((first, second) => second.date.localeCompare(first.date));
        }
        return listings;
    }

    function renderProducts() {
        const listings = getVisibleListings();
        productList.replaceChildren();
        resultCount.textContent = `${listings.length} ${text(listings.length === 1 ? 'productCountOne' : 'productCountMany')}`;
        if (listings.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'market-empty';
            empty.textContent = text('emptyProducts');
            productList.appendChild(empty);
            return;
        }

        const session = getSession();
        const ownerId = getOwnerId(session);
        listings.forEach((listing) => {
            productList.appendChild(createProductCard(listing, session.admin === true || listing.ownerId === ownerId));
        });
    }

    function renderMyListings() {
        const session = getSession();
        const ownerId = getOwnerId(session);
        const listings = readListings().filter((listing) => listing.ownerId === ownerId);
        myListings.replaceChildren();
        if (listings.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'market-empty';
            empty.textContent = text('emptyListings');
            myListings.appendChild(empty);
            return;
        }
        listings.forEach((listing) => myListings.appendChild(createProductCard(listing, true)));
    }

    function renderMarket() {
        try {
            renderProducts();
            renderMyListings();
        } catch (error) {
            console.error('Could not render marketplace listings.', error);
            productList.textContent = text('loadError');
            myListings.textContent = text('ownLoadError');
        }
    }

    function removeListing(id) {
        try {
            const listings = readListings();
            const session = getSession();
            const ownerId = getOwnerId(session);
            const target = listings.find((listing) => listing.id === id);
            if (!target || (target.ownerId !== ownerId && session.admin !== true)) {
                setListingMessage('onlyOwnListings');
                return;
            }
            saveListings(listings.filter((listing) => listing.id !== id));
            renderProducts();
            renderMyListings();
            setListingMessage('listingRemoved');
        } catch (error) {
            console.error('Could not remove marketplace listing.', error);
            setListingMessage('saveError');
        }
    }

    function setActivePanel(panelName) {
        const showingBuy = panelName === 'buy';
        buyPanel.hidden = !showingBuy;
        sellPanel.hidden = showingBuy;
        buyTab.classList.toggle('is-active', showingBuy);
        sellTab.classList.toggle('is-active', !showingBuy);
        buyTab.setAttribute('aria-selected', String(showingBuy));
        sellTab.setAttribute('aria-selected', String(!showingBuy));
        if (!showingBuy) {
            renderMyListings();
        }
    }

    buyTab.addEventListener('click', () => setActivePanel('buy'));
    sellTab.addEventListener('click', () => setActivePanel('sell'));
    document.addEventListener('site-language-change', (event) => {
        currentLanguage = event.detail.lang === 'ar' ? 'ar' : 'en';
        translateMarketContent();
    });
    [searchInput, categoryFilter, currencyFilter, sortFilter].forEach((control) => {
        control.addEventListener('input', renderMarket);
        control.addEventListener('change', renderMarket);
    });

    try {
        const session = getSession();
        if (session.name) {
            listingForm.elements.seller.value = session.name;
        }
        listingForm.addEventListener('submit', (event) => {
            event.preventDefault();
            setListingMessage();
            if (!listingForm.reportValidity()) {
                return;
            }

            try {
                const values = new FormData(listingForm);
                const price = Number(values.get('price'));
                if (!Number.isFinite(price) || price <= 0) {
                    setListingMessage('invalidPrice');
                    return;
                }
                const currentSession = getSession();
                const listings = readListings();
                listings.unshift({
                    id: crypto.randomUUID(),
                    name: String(values.get('name')).trim(),
                    category: String(values.get('category')),
                    price,
                    currency: String(values.get('currency')),
                    condition: String(values.get('condition')),
                    description: String(values.get('description')).trim(),
                    seller: String(values.get('seller')).trim(),
                    contact: String(values.get('contact')).trim(),
                    date: new Date().toISOString().slice(0, 10),
                    ownerId: getOwnerId(currentSession)
                });
                saveListings(listings);
                listingForm.reset();
                listingForm.elements.seller.value = currentSession.name || '';
                renderProducts();
                renderMyListings();
                setListingMessage('listingSaved');
            } catch (error) {
                console.error('Could not create marketplace listing.', error);
                setListingMessage('saveError');
            }
        });

        renderMarket();
    } catch (error) {
        console.error('Could not load marketplace listings.', error);
        productList.textContent = text('loadError');
        myListings.textContent = text('ownLoadError');
    }

    translateMarketContent();

    const sharedScript = document.createElement('script');
    sharedScript.src = new URL('site.js', document.currentScript.src).href;
    sharedScript.onerror = () => console.error(`Could not load shared site behavior: ${sharedScript.src}`);
    document.head.appendChild(sharedScript);
})();
