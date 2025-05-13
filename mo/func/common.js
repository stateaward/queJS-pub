((exp)=>{
    /*
        [queJS Function] common.js
        : 공통 함수
    */
    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    /**
     * 데이터를 가져오는 함수
     * @param {string} [type="GET"] - 요청 타입 (GET, POST 등)
     * @param {string} apiUrl - API URL
     * @param {Object} [data={}] - 요청 데이터
     * @returns {Promise} - 요청 결과를 반환하는 Promise
     */
    const fetchData = function(type = "GET", apiUrl, data = {}) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: type,
                async: true,
                url: apiUrl,
                data: data,
                success: function (data) {
                    resolve(data);
                },
                error: function (e) {
                    console.warn(`[ERROR] at fetchData:${apiUrl}`, e);
                    reject("ERROR");
                },
            });
        });
    };

    /**
     * 데이터를 계층 구조로 변환하는 함수
     * @param {Array} data - 변환할 데이터 배열
     * @returns {Array} - 계층 구조로 변환된 데이터 배열
     */
    const makeLnbData = function(data) {
        const map = {};
        const roots = [];

        /**
         * 키를 재명명하는 헬퍼 함수
         * @param {Object} node - 원본 노드
         * @returns {Object} - 재명명된 키를 가진 노드
         */
        function renameKeys(node) {
            return {
                no: node.dspCtgryNo,
                upperNo: node.upperDspCtgryNo,
                name: node.dspCtgryNm,
                engName: node.dspCtgryEngNm,
                depth: node.ctgryDpthCd,
                sort : node.dspGodSortStdrCd,
                desc : node.dspCtgryDesc,
                children: []
            };
        }

        // 모든 노드를 재명명된 키로 맵에 초기화
        data.forEach(node => {
            const newNode = renameKeys(node);
            map[newNode.no] = newNode;
        });

        // 계층 구조를 빌드
        data.forEach(node => {
            const newNode = map[node.dspCtgryNo];
            if (newNode.upperNo === 'EQL') {
                roots.push(newNode);
            } else if (map[newNode.upperNo]) {
                // 맨 처음엔 ALL 추가
                if (map[newNode.upperNo].children.length === 0) {
                    map[newNode.upperNo].children.push({
                        no: newNode.upperNo,
                        upperNo: newNode.upperNo,
                        name: map[newNode.upperNo].name,
                        engName: 'ALL',
                        depth: newNode.depth,
                        sort: map[newNode.upperNo].sort,
                        desc: map[newNode.upperNo].desc,
                        children: []
                    });
                }
                map[newNode.upperNo].children.push(newNode);
            }
        });

        return roots;
    }

    /**
     * [exports] ID(카테고리 넘버)로 노드를 찾는 함수
     * @param {string} no - 찾을 노드의 ID
     * @param {Object} node - 검색할 노드
     * @returns {Object|null} - 찾은 노드 또는 null
     */
    const findNodeById = function(no, node) {
        if (node.no === no) {
            return node;
        }

        for (const child of node.children) {
            const result = findNodeById(no, child);
            if (result) {
                return result;
            }
        }

        return null;
    }

    /**
     * [exports] 계층 구조에서 ID로 노드를 찾는 함수
     * @param {string} no - 찾을 노드의 ID
     * @param {Array} hierarchy - 검색할 계층 구조
     * @returns {Object|null} - 찾은 노드 또는 null
     */
    const findNodeInHierarchy = function(no, hierarchy) {
        for (const root of hierarchy) {
            const result = findNodeById(no, root);
            if (result) {
                return result;
            }
        }

        return null;
    }

    /**
     * [exports] 검색하는 ID의 상위 노드를 모두 찾아 배열로 반환
     * @param {string} searchNo - 찾을 노드의 ID
     * @param {Array} hierarchy - 검색할 계층 구조
     * @returns {Array}
     * e.g.
     * input : 'EQLA01A02A01A03'
     * output : [{depth1}, {depth2}, {depth3}, {depth4}]
     */
    const findUpperNodeArray = function(searchNo, hierarchy){
        const result = [];
        let currentNo = searchNo;

        while(currentNo){
            const node = findNodeInHierarchy(currentNo, hierarchy);
            if(node){
                result.unshift(node);   // 맨 앞에 계속 추가
                currentNo = node.upperNo === 'EQL' ? null : node.upperNo;   // 상위 노드 존재시 현재값 변경
            } else {
                break;
            }
        }

        return result;
    }

    /**
     * 문자열의 크기를 MB 단위로 반환하는 함수
     * @param {string} str - 문자열
     * @returns {string} - 문자열의 크기 (MB 단위)
     */
    const getStringSizeInMB = function(str) {
        const byteSize = new Blob([str]).size;
        const mbSize = byteSize / (1024 * 1024); // 바이트를 메가바이트로 변환
        return `${mbSize}MB`;
    }

    /**
     * HTML을 최소화하는 함수
     * @param {string} html - HTML 문자열
     * @returns {string} - 최소화된 HTML 문자열
     */
    const minifyHtml = function(html){
        return html.replace(/\s+/g, ' ').trim();
    }

    /**
     * CSS를 삽입하는 함수
     * @param {string} str - CSS 문자열
     */
    const insertCSS = function(str) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(str));
        document.head.appendChild(style);
    }

    /**
     * 디바운스 함수
     * @param {Function} func - 디바운스할 함수
     * @param {number} delay - 지연 시간 (밀리초)
     * @returns {Function} - 디바운스된 함수
     */
    const debounce = function(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // [exports] 페이지 정보 반환
    const getCurrentInfo = function(){
        let pageName = '';
        const mGubun = document.querySelector('#ctgryParams [name="mallGubun"]')?.value;
        const mType = document.querySelector('#ctgryParams [name="mallType"]')?.value;
        const cType = document.querySelector('#ctgryParams [name="ctgryType"]')?.value;
    
        if(mGubun == 'CTGRY'){
            pageName = cType || 'GENERAL';
        }else if(mGubun == 'BRND'){
            pageName = cType;
        }else if(mGubun == 'ETC'){
            pageName = mType || 'ERROR'
        }
    
        return {page_name:pageName, mGubun:mGubun, mType:mType, cType:cType};
    }

    // [exports] 세션 스토리지 저장
    const setStorage = function(key, value){
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    // [exports] 세션 스토리지 조회
    const getStorage = function(key){
        return JSON.parse(sessionStorage.getItem(key));
    }

    // GA4 - 공통 변수
    const ga4_func_queue = new Array();

    // [exports] GA4 - 카테고리명 DOM 업데이트
    const updateDomGA = function(depthArr){
        const $dom = document.querySelector('#ctgryNonParams [name="ctgryNames"]');
        const referer = $dom.value;         // 변경 이전의 데이터
        if(typeof depthArr != 'undefined' && depthArr.length > 0){
            $dom.value = depthArr.join('>');
        }
        return (referer) ? referer.split('>') : [];
    }

    // GA4 - 글로벌 DOM에 선언된 카테고리를 Array로 반환
    const getCtgryNameArr = function(){
        const $dom = document.querySelector('#ctgryNonParams [name="ctgryNames"]');
        const ctgryName = $dom?.value;
        
        return (ctgryName) ? ctgryName.split('>') : [];
    }

    // [exports] GA4 - 대기열 함수 비우기(flush)
    const flushGA4 = function(){
        while(ga4_func_queue.length > 0){
            const task = ga4_func_queue.shift();
            task();
        };
    }

    // [exports] GA4 - category 미할당시, 대기열 push하는 검증 데코레이터
    const validGA4 = function(func){
        return function(...args){
            const ctgryNames = getCtgryNameArr();
            if(ctgryNames.length <= 0){
                ga4_func_queue.push(()=>{func(...args)});
            }else{
                return func(...args);
            }
        };
    }
    
    // [exports] GA4 - 이벤트 태깅 카테고리명 분기별 추출
    const getEvnetParam = function(ga_action = "LNB", currnetDepthArr = [], refererDepthArr = []){
        let category = '';
        let action = '';
        let label = currnetDepthArr;
        const depth_name = getCtgryNameArr();

        const {page_name} = getCurrentInfo();
        switch(page_name){
            case 'SIS':
            case 'BRND':
                const title_mo = document.querySelector('#__title__')?.innerText;
                category = `브랜드_${title_mo}`;
                action = '상품 탭';
                break;
            case 'EXCLUSIVE':
                category = `EXCLUSIVE`;
                action = '탭메뉴';
                break;
            case 'QOLLECT':
                category = `QOLLECT`;
                action = '탭메뉴';
                break;
            case 'OUTLET':
                category = `아울렛`;
                action = '탭메뉴';
                break;
            case 'WELLNESS':
                category = `WELLNESS CLUB`;
                action = '탭메뉴';
                break;
            case 'REVIEW':
                category = `리뷰관_${refererDepthArr.length > 0 ? refererDepthArr.join('_') : '전체'}`;
                label = label.length > 0 ? label.join('_') : '전체';
                action = '플로팅메뉴';
                break;
            case 'KWD':
                if(ga_action == 'FILTER'){
                    category = '키워드'
                }
                break;
            default:
                if(ga_action == 'LNB'){
                    label.shift();
                    label = label.length > 0 ? label.join('_') : '전체';
                    category = `DEPTH_${refererDepthArr.length > 0 ? refererDepthArr.join('_') : '전체'}`;    // category는 클릭 이전 시점으로
                }else{
                    depth_name.shift();
                    category = category = `DEPTH_${depth_name.join('_')}`;
                }
                action = '플로팅메뉴';
                break;
        }

        if(Array.isArray(label)){
			label = label.join('_');
		}

        return {category, action, label};
    }
    
    /**
     * [exports] input 데이터를 result에 매핑하는 함수
     * @param {Array} inputData - 원본 input 데이터 (예: input.result)
     * @param {Array} targetObj - 대상 result 데이터
     * @param {string} key - input 데이터에서 비교할 키 (예: "NO")
     * @param {Object} opt - 매핑할 컬럼명 옵션 (예: { 'CNT': 'count', 'DESC': 'description' })
     * @returns {Array} - 업데이트된 result 데이터
     */
    const assignListToLnbData = function(inputData, targetObj, key, opt) {
        const lower_key = key.toLowerCase();
        const inputMap = {};

        inputData.forEach(item => {
            inputMap[item[key]] = item;
        });

        function processNode(node) {
            // node.no와 일치하는 input 데이터가 있는지 확인
            if (inputMap.hasOwnProperty(node[lower_key])) {
                // 각 옵션에 대해 새로운 컬럼 추가
                for (const [inputKey, outputKey] of Object.entries(opt)) {
                    if (inputMap[node[lower_key]][inputKey] !== undefined) {
                        node[outputKey] = inputMap[node[lower_key]][inputKey];
                    }
                }
            }

            // 자식 노드가 있으면 재귀적으로 처리
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => processNode(child));
            }
        }

        // 모든 최상위 result 노드에 대해 처리
        targetObj.forEach(rootNode => processNode(rootNode));
        return targetObj;
    }

    const addCommas = function(number) {
        // 숫자를 문자열로 변환 후, 정규표현식을 사용하여 3자리마다 콤마 삽입
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.fetchData = fetchData;
    exp.makeLnbData = makeLnbData;
    exp.findNodeById = findNodeById;
    exp.findNodeInHierarchy = findNodeInHierarchy;
    exp.findUpperNodeArray = findUpperNodeArray;
    exp.getStringSizeInMB = getStringSizeInMB;
    exp.minifyHtml = minifyHtml;
    exp.insertCSS = insertCSS;
    exp.debounce = debounce;
    exp.getCurrentInfo = getCurrentInfo;
    exp.assignListToLnbData = assignListToLnbData;
    exp.addCommas = addCommas;

    exp.SESSION_STORAGE = exp.SESSION_STORAGE || {};
    exp.SESSION_STORAGE.set = setStorage;
    exp.SESSION_STORAGE.get = getStorage;

    exp.GA = exp.GA || {};
    exp.GA.updateDomGA = updateDomGA;
    exp.GA.getEvnetParam = getEvnetParam;
    exp.GA.validGA4 = validGA4;
    exp.GA.flushGA4 = flushGA4;
})(window.$QFn);