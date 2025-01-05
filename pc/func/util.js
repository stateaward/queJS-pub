((exp)=>{
    /*
        [queJS Function] util.js
        : 유틸성 함수
        : (common.js로 변경, 삭제 예정)
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
                children: []
            };
        }

        // Initialize the map with all nodes, with renamed keys
        data.forEach(node => {
            const newNode = renameKeys(node);
            map[newNode.no] = newNode;
        });

        // Build the hierarchy
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

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.fetchData = fetchData;
    exp.transformToHierarchy = transformToHierarchy;
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