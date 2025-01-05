((exp)=>{
    /*
        [queJS Function] util.js
        : 유틸성 함수
        : (common.js로 변경, 삭제 예정)
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
                        children: []
                    });
                }
                map[newNode.upperNo].children.push(newNode);
            }
        });

        return roots;
    }

    /**
     * ID(카테고리 넘버)로 노드를 찾는 함수
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
     * 계층 구조에서 ID로 노드를 찾는 함수
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

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.fetchData = fetchData;
    exp.makeLnbData = makeLnbData;
    exp.findNodeById = findNodeById;
    exp.findNodeInHierarchy = findNodeInHierarchy;
    exp.getStringSizeInMB = getStringSizeInMB;
    exp.minifyHtml = minifyHtml;
    exp.insertCSS = insertCSS;
    exp.debounce = debounce;
    exp.getCurrentInfo = getCurrentInfo;

    exp.SESSION_STORAGE = exp.SESSION_STORAGE || {};
    exp.SESSION_STORAGE.set = setStorage;
    exp.SESSION_STORAGE.get = getStorage;
})(window.$QFn);