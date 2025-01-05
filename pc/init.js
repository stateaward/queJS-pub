(() => {
    // 로드된 스크립트를 추적하는 Set 추가
    const loadedScripts = new Set();
    
    function loadScripts(scripts, callback) {
        let $timestamp = document.querySelector('[name="timestamp"]');
        const tmstpUrl = $timestamp ? `?timestamp=${$timestamp.value}` : '';
        const prefixUrl = new URL(document.location.href).origin;

        let loadedCount = 0;
        const scriptsToLoad = scripts.filter(src => !loadedScripts.has(src));

        function onLoad(src) {
            loadedScripts.add(src);
            loadedCount++;
            if (loadedCount === scriptsToLoad.length && callback) {
                callback();
            }
        }

        if (scriptsToLoad.length === 0) {
            // 모든 스크립트가 이미 로드되었다면 즉시 콜백 실행
            if (callback) callback();
            return;
        }

        const fragment = document.createDocumentFragment();
        scriptsToLoad.forEach((src) => {
            const newSrc = `${prefixUrl}/resources/js/queJS/${src}${tmstpUrl}`;
            
            const script = document.createElement("script");
            script.src = newSrc;
            script.async = true;
            script.onload = () => onLoad(src);
            script.onerror = () => console.error(`⚡[queJS] Failed to load script: ${newSrc}`);
            fragment.appendChild(script);
        });
        document.head.appendChild(fragment);
    }

    // [exports]
    const render = function(componentName, callback) {
        try {
            const $target = document.querySelector(`[data-que-component="${componentName}"]`);
            $target.innerHTML = callback;
        } catch (error) {
            console.error(`⚡[queJS] Failed to render component: ${componentName} - ${error}`);
        }
    }

    // [exports]
    const init = function(initDependency, finalCallback){
        const loadPromises = initDependency.map(script => 
            new Promise((resolve, reject) => {
                loadScripts([script], resolve);
            })
        );
        
        Promise.all(loadPromises).then(finalCallback).catch(error => {
            console.error("⚡[queJS] Failed to load all scripts:", error);
        });
    }

    // [exports]
    const initUI = function(uiName, dependency, afterLoad){
        window.$QUI[uiName] = window.$QUI[uiName] || {};
        window.$QUI[uiName].COMP = window.$QUI[uiName].COMP || {};

        loadScripts(dependency, afterLoad);
    }

    // QueJS 기본 설정
    const initQueJS = function(){
        // Core
        window.$Que = window.$Que || {};
        $Que.render = render;
        $Que.init = init;
        $Que.initUI = initUI;

        // UI
        window.$QUI = window.$QUI || {};
        window.$QUI.Misc = window.$QUI.Misc || {};
        window.$QUI.Misc.COMP = window.$QUI.Misc.COMP || {};

        // Function
        window.$QFn = window.$QFn || {};
    }

    initQueJS();    // 초기화 실행
})();