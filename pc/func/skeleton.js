((exp)=>{
    /*
        [queJS Function] skeleton.js
        : 스켈레톤 관련 함수
    */
    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // 옵저버 설정
    const setupObserver = function(){
        function observerCB(entry, observer){
            if(entry.isIntersecting){
                syncEqual();
                observer.unobserve(entry.target);
            }
        }
        
        const $targets = document.querySelectorAll(`[data-skeleton="syncEqual"]`);
        if($targets){
            const preCatch = '0px';
            const io = new IntersectionObserver(([entry]) => observerCB(entry, io), {threshold: 0, rootMargin: preCatch});
            $targets.forEach(target => io.observe(target));
        }
    }

    // wait 상태 모든 동기화 대상 캡쳐
    const captureSyncTarget = function(){
        const $syncTargets = document.querySelectorAll('.skeleton[data-sync-type="equal"][data-sync-state="wait"]');
        const godNoAllList = [];
        
        // 전체 요소 대상
        $syncTargets.forEach($target => {
            updateSyncState($target, 'pending');
            const value = $target.dataset.equalValue;
            if(value) godNoAllList.push(value);
        });

        return godNoAllList;
    }

    // [exports] chunkSize 만큼 처리
    const syncEqual = async function(){
        const chunkSize = 200;
        const godNoAllList = captureSyncTarget();
        console.log(`⚡[skeleton] syncEqual : ${godNoAllList.length}`);

        for(let i = 0; i < godNoAllList.length; i+=chunkSize){
            const dividedList = godNoAllList.slice(i, i+chunkSize);
            await processEqual(dividedList);
        }

        // 싱크 대상 업데이트 후 스켈레톤 검증
        validateSkeleton();
    }

    // 이퀄 카운트 결과값 처리 -> fetch + update DOM
    const processEqual = async function(godNoList){
        // console.time('processEqual');
        // console.time('fetch');
        const response = await $QFn.fetchData("POST", "/sync/v2/equalCount", {godNos: godNoList})
        // console.timeEnd('fetch');
        
        if(response.resultCd === 'SUCCESS' && response.result.length > 0){
            response.result.forEach(item => {
                try {
                    const $target = document.querySelector(`.skeleton[data-sync-type="equal"][data-sync-state="pending"][data-equal-value="${item.GOD_NO}"]`);
                    if($target){
                        updateSync($target, item);
                    }
                } catch (error) {
                }
            });
        }else{
            godNoList.forEach(godNo => {
                const $target = document.querySelector(`.skeleton[data-sync-type="equal"][data-sync-state="pending"][data-equal-value="${godNo}"]`);
                if($target) {
                    updateDOM($target, 0, 'N');
                    updateSyncState($target, 'error');
                };
            });
            console.error(`⚡[queJS] Failed to processEqual -- ${response.resultMsg}`);
        }
        // console.timeEnd('processEqual');
    }

    // 이퀄 결과값 처리 : DOM 이퀄값 업데이트 + 싱크 상태 업데이트
    const updateSync = function($dom, data){
        try {
            const state = updateDOM($dom, data.EQUAL_CNT, data.EQUAL_YN);
            updateSyncState($dom, state);
        } catch (error) {
            console.warn(`⚡[queJS] Failed to updateSync -- ${error}`);
        }
    }

    /*
        DOM 싱크 상태 업데이트
        - state : done | error => 스켈레톤 제거
        - state : wait | pending => 스켈레톤 유지
    */
    const updateSyncState = function($dom, state){
        if(state == 'done' || state == 'error'){   
            $dom.classList.remove('skeleton');
        }
        $dom.dataset.syncState = state;
    }

    // DOM 자체 업데이트
    const updateDOM = function($dom, equalCnt = 0, equalYn = 'N'){
        try {
            $dom.innerHTML = (equalCnt > 999) ? '999+' : equalCnt;

            if(equalYn === 'Y'){
                $dom.classList.add('is_active');
            }
            return 'done';
        } catch (error) {
            console.warn(`⚡[queJS] Failed to updateDOM -- ${error}`);
            return 'error';
        }
    }

    // [exports] 에러 상태 검증 및 일괄 기본 DOM 처리
    const validateSkeleton = function(){
        const $errorTargets = document.querySelectorAll(`.skeleton[data-sync-type="equal"][data-sync-state="error"]`);
        const $notSetTargets = document.querySelectorAll(`.skeleton[data-sync-type="equal"][data-sync-state="pending"]`);

        if($errorTargets || $notSetTargets){
            console.warn(`⚡[queJS] skeleton-report : error(${$errorTargets.length || 0}) | notSet(${$notSetTargets.length || 0})`);

            // 이퀄수 0개 일괄 처리
            $notSetTargets.forEach($target => updateSync($target, {equalCnt:0, equalYn:'N'}));
            // 에러 스켈레톤 일괄 0 처리
            $errorTargets.forEach($target => updateSync($target, {equalCnt:0, equalYn:'N'}));
        }
    }

    // [exports] 스켈레톤 초기화
    const init = function(){
        // initCssSkeleton();
        setupObserver();
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.SKELETON = exp.SKELETON || {};
    exp.SKELETON.init = init;
    exp.SKELETON.syncEqual = syncEqual;
    exp.SKELETON.validateSkeleton = validateSkeleton;
})(window.$QFn);