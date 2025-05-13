((exp)=>{
    /*
        [queJS Function] common.js
        : 공통 함수
    */
    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports]
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
    
    // [exports]
    const transformToHierarchy = function(data) {
        const map = {};
        const roots = [];

        // Helper function to rename keys
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
                map[newNode.upperNo].children.push(newNode);
            }
        });

        return roots;
    }

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

    // [exports]
    const findNodeInHierarchy = function(no, hierarchy) {
        for (const root of hierarchy) {
            const result = findNodeById(no, root);
            if (result) {
                return result;
            }
        }

        return null;
    }

    // @deprecated
    const findNodeByDepth = function(depth, node) {
        if (node.depth === depth) {
            return node;
        }

        for (const child of node.children) {
            const result = findNodeByDepth(depth, child);
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

    // [exports]
    const getStringSizeInMB = function(str) {
        const byteSize = new Blob([str]).size;
        const mbSize = byteSize / (1024 * 1024); // 바이트를 메가바이트로 변환
        return `${mbSize}MB`;
    }

    // [exports]
    const minifyHtml = function(html){
        return html.replace(/\s+/g, ' ').trim();
    }

    // [exports]
    const insertCSS = function(str) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(str));
        document.head.appendChild(style);
    }

    // [exports] debounce 함수 정의
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
                const title_pc = document.querySelector('.brand .prd_title p')?.innerText
                category = `브랜드_${title_pc}`;
                action = '상품 탭';
                break;
            case 'EXCLUSIVE':
                category = `EXCLUSIVE`;
                action = '탭메뉴';
                break;
            case 'OUTLET':
                category = `아울렛`;
                action = '탭메뉴';
                break;
            case 'QOLLECT':
            case 'WELLNESS':
                // PC : 미존재
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
    exp.transformToHierarchy = transformToHierarchy;
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