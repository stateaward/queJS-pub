((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.LnbDepth1 = ({item, selectedNo}) => {
        const isActive = $QUI.Lnb.isPartOf(selectedNo, item.no, 1);
        const hasChild = (item.children?.length > 0);
        
        const newChildren = Array.isArray(item.children) ? [...item.children] : [];
        if(hasChild == true){
            const newItem = {
                "no": item.no,
                "name": "전체",
                "engName": "ALL",
                "depth": item.depth,
                "sort": item.sort
            };
    
            newChildren.unshift(newItem);
        }
        
        return `
            <li class="depth1 ${isActive ? 'on' : ''}" data-depth-cd="1" onclick="$QUI.Lnb.clickLnb(event)" data-dsp-ctgry-no="${item.no}" data-sort="${item.sort}">
                <a href="javascript:void(0);">
                    <em>${item.engName}</em>
                    <span>${item.name}</span>
                </a>
                ${(isActive && hasChild && (item.depth == 1)) ? `
                    <ul class="sub_menu" data-depth-cd="1" data-trigger-no="${item.no}" style="display:block">
                        ${newChildren.map(child => $QUI.Lnb.COMP.LnbDepth2({item:child, selectedNo:selectedNo})).join('')}
                    </ul>
                ` : ''}
            </li>
        `;
    };

    exp.COMP.LnbDepth2 = ({item, selectedNo}) => {
        if(Object.values($QUI.Lnb._excludeDict).includes(item.no)) return '';
    
        const isActive = $QUI.Lnb.isPartOf(selectedNo, item.no, 2);
        const hasChild = (item.children?.length > 0);
    
        const newChildren = Array.isArray(item.children) ? [...item.children] : [];
        if(hasChild == true){
            const newItem = {
                "no": item.no,
                "name": "전체",
                "engName": "ALL",
                "depth": item.depth,
                "sort": item.sort
            };
    
            newChildren.unshift(newItem);
        }
        
        return `
            <li class="depth2 ${isActive ? 'on' : ''}" onclick="$QUI.Lnb.clickLnb(event)" data-depth-cd="2" data-dsp-ctgry-no="${item.no}" data-sort="${item.sort}">
                <a href="javascript:void(0);">
                    <em>${item.engName}</em>
                    <span>${item.name}</span>
                </a>
                ${(isActive && hasChild) ? `
                    <ul class="${($QUI.Lnb._startDepth == 0) ? 's_menu' : 'sub_menu'}" data-depth-cd="2" data-trigger-no="${item.no}" style="display: block;">
                        ${newChildren.map(child => $QUI.Lnb.COMP.LnbDepth3({item:child, selectedNo:selectedNo})).join('')}
                    </ul>
                ` : ''}
            </li>
        `;
    };

    exp.COMP.LnbDepth3 = ({item, selectedNo}) => {
        const isActive = $QUI.Lnb.isPartOf(selectedNo, item.no, 3);
        const hasChild = (item.children?.length > 0);
    
        const newChildren = Array.isArray(item.children) ? [...item.children] : [];
        if(hasChild == true){
            const newItem = {
                "no": item.no,
                "name": "전체",
                "engName": "ALL",
                "depth": item.depth,
                "sort": item.sort
            };
    
            newChildren.unshift(newItem);
        }
        
        return `
            <li class="depth3 ${isActive ? 'on' : ''}" onclick="$QUI.Lnb.clickLnb(event)" data-depth-cd="3" data-dsp-ctgry-no="${item.no}" data-sort="${item.sort}">
                <a href="javascript:void(0);">
                    ${item.engName == null ? '' : `
                    <em>${item.engName}</em>
                    `}
                    <span>${item.name}</span>
                </a>
            </li>
        `;
    };

    exp.COMP.LnbDepth4 = ({item, selectedNo}) => {
        const isActive = $QUI.Lnb.isPartOf(selectedNo, item.no, 4);
        const hasChild = (item.children?.length > 0);

        const newChildren = Array.isArray(item.children) ? [...item.children] : [];
        if(hasChild == true){
            const newItem = {
                "no": item.no,
                "name": "전체",
                "engName": "ALL",
                "depth": item.depth,
                "sort": item.sort
            };

            newChildren.unshift(newItem);
        }
        
        return `
            <div class="tab_style5 depth4_wrapper on" data-tab="tab-${item.no}" data-dsp-ctgry-no="${item.no}" data-depth-cd="4">
                ${newChildren.map(child => $QUI.Lnb.COMP.LnbDepth4Item({item:child, selectedNo:selectedNo})).join('')}
            </div>
        `;
    };

    exp.COMP.LnbDepth4Item = ({item, selectedNo}) => {
        const isActive = $QUI.Lnb.isPartOf(selectedNo, item.no, 4);

        return `
            <button type="button" class="tab_btn depth4 ${isActive ? 'is_active' : ''}" data-dsp-ctgry-no="${item.no}" data-depth-cd="4" onclick="$QUI.Lnb.clickLnbDepth4(event);" data-sort="${item.sort}">
                ${item.name}
            </button>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports]
    const clickLnbDepth4 = function(event){
        event.stopPropagation();
        const $eventTarget = event.target;
        const parentNo = $eventTarget?.closest('div')?.dataset.dspCtgryNo;
        const selectedNo = $eventTarget?.closest('button')?.dataset.dspCtgryNo;
        
        const data = $QFn.findNodeInHierarchy(parentNo, $QUI.Lnb._lnbData);
        $QUI.Lnb.renderLnbDepth4(data, selectedNo);

        // 기본 정렬값 셋팅
        const defaultsort = document.querySelector('#ctgryNonParams [name="defaultSort"]')?.value;
        let sortCd = '';
        if(defaultsort == 'LNB'){
            const lnbSortCd = $eventTarget?.dataset.sort;
            sortCd = $QUI.Sort.initSort(lnbSortCd);
        }else if(defaultsort == 'NONE') {
            sortCd = '';
        }else{
            sortCd = $QUI.Sort.initSort(defaultsort);
        }
        const {page_name} = $QFn.getCurrentInfo();
        if(page_name == 'REVIEW'){
            $QFn.CTGRY.updateForm({selectCtgryNo:selectedNo,sort:sortCd,page:1,back:'N'}, 'none');
            getReviewList();
        }else{
            $QFn.CTGRY.updateForm({selectCtgryNo:selectedNo,sort:sortCd,page:1,back:'N'}, 'getList', 'reset');
        }
    };

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.clickLnbDepth4 = clickLnbDepth4;
})(window.$QUI.Lnb);