((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.Lnb = ({data, selectedNo}) => {
        const newItem = {
            "no": data[0]?.no.substr(0,6),
            "name": "전체",
            "engName": "ALL",
            "depth": data[0].depth,
            "sort": data[0].sort || null
        };
        
        const newData = [...data];
        newData.unshift(newItem);
    
        return  `
            <ul class="left_menu">
                ${newData.map(item => $QUI.Lnb.COMP.LnbDepth2({item:item, selectedNo:selectedNo})).join('')}
            </ul>
        `;
    };
    
    exp.COMP.LnbTop = ({data, selectedNo}) => {
        // 0뎁스(EQL) 부터 시작
        const newItem = {
            "no": "EQL",
            "name": "전체",
            "engName": "ALL",
            "depth": "1",
            "sort": null
        };
        
        const newData = [...data];
        newData.unshift(newItem);
    
        return  `
            <ul class="left_menu">
                ${newData.map(item => $QUI.Lnb.COMP.LnbDepth1({item:item, selectedNo:selectedNo})).join('')}
            </ul>
        `;
    };
        

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports]
    const isPartOf = (selectedNo, parentNo, nowDepth) => {
        const componentDepth = Number(nowDepth) * 3;
        let result = false;

        if(parentNo?.length === componentDepth){
            result = (selectedNo === parentNo);
        }else{
            result = selectedNo.startsWith(parentNo);
        }
        return result;
    };

    // [exports]
    const clickLnb = function(event){
        event.stopPropagation();
        const $eventTarget = event.target?.closest('li');
        const no = $eventTarget?.dataset.dspCtgryNo;
        const depthCd = Number($eventTarget?.dataset.depthCd);
        
        renderLnb(no);

        if(depthCd === 3 && no.length >= 12){
            // 4depth 생성
            const data = $QFn.findNodeInHierarchy(no, $QUI.Lnb._lnbData);
            renderLnbDepth4(data, no);
        }else{
            // 4depth 삭제
            const $target = document.querySelector('[data-que-component="LnbDepth4"]');
            $target.innerHTML = '';
        }

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
            $QFn.CTGRY.updateForm({selectCtgryNo:no,sort:sortCd,page:1,back:'N'}, 'none');
            getReviewList();
        }else{
            $QFn.CTGRY.updateForm({selectCtgryNo:no,sort:sortCd,page:1,back:'N'}, 'getList', 'reset');
        }
    };

    // [exports]
    const renderLnb = function(no){
        const mGubun = document.querySelector('[name="mallGubun"]')?.value;

        const $target = document.querySelector('[data-que-component="Lnb"]');
        if(mGubun == 'CTGRY' && $QUI.Lnb._startDepth == 1){
            $target.innerHTML = $QUI.Lnb.COMP.Lnb({data:$QUI.Lnb._lnbData[0].children, selectedNo:no});
        }else{
            $target.innerHTML = $QUI.Lnb.COMP.LnbTop({data:$QUI.Lnb._lnbData, selectedNo:no});
        }
    }

    // [exports]
    const renderLnbDepth4 = function(data, no){
        const $target = document.querySelector('[data-que-component="LnbDepth4"]');
        $target.innerHTML = $QUI.Lnb.COMP.LnbDepth4({item:data, selectedNo:no});
    }


    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.isPartOf = isPartOf;
    exp.clickLnb = clickLnb;
    exp.renderLnb = renderLnb;
    exp.renderLnbDepth4 = renderLnbDepth4;

    exp._lnbData = [];
    exp._startDepth = 0;
    exp._excludeDict = {};
})(window.$QUI.Lnb);

