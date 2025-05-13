((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.Sort = ({selectedSort, isClicked}) => {
        const cType = document.querySelector('#ctgryParams [name="ctgryType"]')?.value;
        const sortDictionary = (cType == 'BEST') ? sortBestDict : $QUI.Sort._sortDict;
        const selectedItem = validation(selectedSort);
    
        return  `
            <div class="custom_select_wrap float_type ${isClicked ? 'is_active' : ''}">
                <button type="button" class="option_selected" value="${selectedItem.cd}" onclick="$QUI.Sort.clickSort(event);">${selectedItem.korNm}</button>
                ${isClicked ? `
                    <ul class="option_list" style="display: block;">
                        ${sortDictionary.map(item => $QUI.Sort.COMP.SortItem({item:item})).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
    };
    
    exp.COMP.SortItem = ({item}) => {
        return `
            <li>
                <button type="button" class="option" value="${item.cd}" onclick="$QUI.Sort.clickSort(event);">${item.korNm}</button>
            </li>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    const sortBestDict = [
        {idx:1, cd:'REAL_TIME_GOD_BEST', korNm:'실시간'},
        {idx:2, cd:'DAILY_SALE_SEQ', korNm:'일간'},
        {idx:3, cd:'WEEKLY_SALE_SEQ', korNm:'주간'},
        {idx:4, cd:'MONTHLY_SALE_SEQ', korNm:'월간'},
    ];
    
    // [exports]
    const clickSort = function(event){
        event.stopPropagation();
        const $eventTarget = event.target?.closest('button');
        const sortCd = $eventTarget?.value;
        const isOpen = $eventTarget?.classList.contains('option_selected');
        
        if(isOpen){
            const $optionList = document.querySelector('div[data-que-component="Sort"] .option_list');
            if($optionList){
                // 선택안하고 BOX 클릭시, 닫기
                renderSort(sortCd, false);
            }else{
                // 여기서 URL Setup
                renderSort(sortCd, true);
            }
        }else{
            renderSort(sortCd, false);
            $QFn.CTGRY.updateForm({sort:sortCd,page:'1',back:'N'}, 'getList');
            $QFn.CTGRY.getFilterCount('CTGRY');
            ga4_sendEventTag(sortCd);
        }
    }
    
    const renderSort = function(selectedSort, isClicked){
        const $target = document.querySelector('[data-que-component="Sort"]');
        $target.innerHTML = $QUI.Sort.COMP.Sort({selectedSort:selectedSort, isClicked:isClicked});
    }
    
    // [exports][뒤로가기]
    const initSort = function(sortCode){
        try {
            let sortCd = '';
            if(typeof sortCode != 'undefined' && sortCode != null && sortCode != ''){
                sortCd = sortCode;
            }else{
                sortCd = document.querySelector('#ctgryParams [name="sort"]')?.value;
            }
            if(sortCd == 'NONE'){
                return;
            }
    
            const validSort = validation(sortCd);
            renderSort(validSort.cd, false);
            return validSort.cd;
        } catch (error) {
            console.warn(`⚡eqUI⚡error at initSort :: ${error} `);
        }
    }
    
    // 입력된 정렬값을 검증하고, 없을 경우 기본 정렬 객체를 반환
    const validation = function(sortCode){
        let resultSort = null;
        const isBestCtgry = document.querySelector('#ctgryParams [name="ctgryType"]')?.value == 'BEST';
        const sortDictionary = isBestCtgry ? sortBestDict : $QUI.Sort._sortDict;
    
        try {
            resultSort = sortDictionary.find(item => item.cd == sortCode);
            if(!resultSort) throw new Error(`${sortCode} is not define`);
        } catch (error) {
            console.warn('⚡[queJS] Not Matched: ', error);
            const defaultCd = isBestCtgry ? 'DAILY_SALE_SEQ' : 'NEW_GOD_SEQ';
            resultSort = sortDictionary.find(item => item.cd == defaultCd);
        }
    
        return resultSort;
    }

    // GA4 - 이벤트 태그 발생
    const sendEventTag = function(sortCd){
        try {
            const {category} = $QFn.GA.getEvnetParam('SORT');
            const label = getSortName(sortCd);
            GA4.EVENT.set(category, "정렬", label);
        } catch (error) {
        }
    }

    // GA4 - 검증 후 보내는 함수
    const ga4_sendEventTag = $QFn.GA.validGA4(sendEventTag);

    // 정렬 한글명 추출
    const getSortName = function(sortCd){
        const {page_name} = $QFn.getCurrentInfo();
        const sortDictionary = page_name == 'BEST' ? sortBestDict : $QUI.Sort._sortDict;
        const sortObj = sortDictionary.find(item => item.cd == sortCd);

        return sortObj.korNm;
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.clickSort = clickSort;
    exp.initSort = initSort;
})(window.$QUI.Sort);