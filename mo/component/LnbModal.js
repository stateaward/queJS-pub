((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.LnbModal = ({data, selectedNo}) => {
        return `
            <ul class="btn_list ctgryModalBottomSheet">
                ${data.map(child => $QUI.Lnb.COMP.LnbModalDropBox({item:child, selectedNo})).join('')}
            </ul>
        `;
    };
    
    exp.COMP.LnbModalDropBox = ({item, selectedNo}) => {
        const isActive = $QUI.Lnb.isPartOf(selectedNo, item.no, 2);
        const hasChild = (item.children?.length > 0);
    
        return `
            ${!hasChild ? `
                <li class="${isActive ? 'is_active' : ''}">
                    <a href="javascript:void(0);" onclick="$QUI.Lnb.clickLnbModal(event, 'link')" data-dsp-ctgry-no="${item.no}">${item.name}</a>
                </li>
            ` : `
                <li class="drop_box">
                    <button type="button" class="btn_drop ${isActive ? 'on' : ''}" data-dsp-ctgry-no="${item.no}" data-event="dropdown">
                        ${item.name}
                    </button>
                    <ul class="drop_list" data-dsp-ctgry-no="${item.no}" style="display: ${isActive ? 'block' : 'none'};">
                        ${item.children.map(child => $QUI.Lnb.COMP.LnbModalDropList({item:child, selectedNo})).join('')}
                    </ul>
                </li>
            `}
        `;
    };
    
    exp.COMP.LnbModalDropList = ({item, selectedNo}) => {
        const isActive = $QUI.Lnb.isPartOf(selectedNo, item.no, 3);
    
        const name = (item.no === item.upperNo) ? '전체' : item.name;
        return `
            <li class="${isActive ? 'is_active' : ''}">
                <a href="javascript:void(0);" onclick="$QUI.Lnb.clickLnbModal(event)" data-dsp-ctgry-no="${item.no}" data-upper-ctgry-no="${item.upperNo}" data-sort="${item.sort}">${name}</a>
            </li>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    const renderModal = function(selectedNo){
        const $target = document.querySelector('[data-que-component="LnbModal"]');
        $target.innerHTML = $QUI.Lnb.COMP.LnbModal({data:$QUI.Lnb._lnbData[0].children, selectedNo:selectedNo});
    }
    
    const clickLnbModal = function(event, type){
        try {
            event.stopPropagation();
            const $eventTarget = event.target?.closest('a');
            const no = $eventTarget?.dataset.dspCtgryNo;
            const upperNo = $eventTarget?.dataset.upperCtgryNo;

            try {
                // [GA4] 트래킹 : 페이지뷰 + 맞춤 이벤트
                const isSkipPageView = type == 'link' ? true : false;       // Link 이동시 페이지뷰 미전송 처리
                $QUI.Lnb.ga4_tracking(no, 'LNB_MODAL', isSkipPageView);
            } catch (error) {
            }
    
            if(type === 'link'){
                const excludeName = Object.keys($QUI.Lnb._excludeDict).find(key=>$QUI.Lnb._excludeDict[key] == no) || 'SNB';
                let url = '';
    
                if(excludeName.indexOf('NEW') > -1){
                    url = `/display/productsListCntt?categoryNumber=${no}&newYn=Y`;
                }else if(excludeName.indexOf('BEST') > -1){
                    url = `/display/productsList?categoryNumber=${no}&bestYn=Y`;
                }else{
                    url = `/display/snbList?categoryNumber=${no}`
                }
                location.href = url;
                return;
            }
    
            const {page_name} = $QFn.getCurrentInfo();
            if(page_name != 'GENERAL'){
                location.href = `/display/productsList?categoryNumber=${no}`;
                return;
            }
    
            updateHeadTitle(upperNo);
            
            renderModal(no);
            $QUI.Lnb.renderLnb(no);
    
            const sortCd = $QUI.Lnb.setSort($eventTarget);
            $QFn.CTGRY.updateForm({selectCtgryNo:no,sort:sortCd,page:1,back:'N'}, 'getList', 'reset');
    
            // 모달 닫기
            ModalBSClose('#ctgryModalBottomSheet');
        } catch (error) {
            console.error(`⚡[queJS] Failed to clickLnbModal : ${error}`);
        }
    }
    
    const updateHeadTitle = function(upperNo){
        const upperNode = $QFn.findNodeById(upperNo, $QUI.Lnb._lnbData[0]);
        const $headTitle = document.querySelector('#__title__ .head_tit');
        $headTitle.textContent = upperNode.name;
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.renderModal = renderModal;
    exp.clickLnbModal = clickLnbModal;
})(window.$QUI.Lnb);