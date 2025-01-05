(()=>{
    function getCurrentType(){
        const urlObj = new URL(location.href);
        const url = urlObj.pathname;

        let type = '';
        if(url.indexOf('/prodcut/') > -1){
            type = 'PRODUCT';
        }else if(url.indexOf('/brands/main') > -1){
            type = 'BRAND';
        }
        return type
    }

    const PlanListDependencies = [
        `component/Promo.js`,
    ];

    $Que.initUI('Promo', PlanListDependencies, async ()=>{
        const brndId = document.querySelector('#PromoBrndId')?.value || '';
        const chApiDomain = document.querySelector('#chApiDomain')?.value;
        const apiUrl = `${chApiDomain}v1/promotion/brand/${brndId}?device=m&limit=10`;
        const response = await $QFn.fetchData('GET', apiUrl);

        if(response.status == 200 && $QUI.Promo.isArrayNull(response.data) == false){
            if(getCurrentType() == 'BRAND'){
                $Que.render('PromoSection', $QUI.Promo.COMP.Promo(response.data));
            }else{
                $Que.render('PromoSection', $QUI.Promo.COMP.PromoProductDetail(response.data));
            }
            $QUI.Promo.initSwiper();
            comm.setTimerBadge();
        }
    });
})();