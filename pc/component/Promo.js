((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    // 브랜드 상세>기획전
    exp.COMP.Promo = (promoList)=>{
        return `
            <section class="section_gap2">
                <div class="tit_area brand">
                    <h2 class="tit_lv2">주목할만한 이벤트</h2>
                    <div class="pagination swiper_br02">
                            <a href="#none" class="swiper-button-prev">앞으로</a>
                            <a href="#none" class="swiper-button-next">뒤로</a>
                        </div>
                    </div>
                <div class="swiper swiper_br_dtl_02">
                    <ul class="swiper-wrapper product_info product_list_evt badge_s">
                        ${promoList.map(slide => $QUI.Promo.COMP.PromoSlide(slide,'브랜드_이벤트')).join('')}
                    </ul>
                </div>
            </section>
        `;
    };

    // 상품 상세>연관기획전
    exp.COMP.PromoProductDetail = (promoList)=>{
        return `
            <section class="section_block100">
                <div class="tit_area">
                    <div class="tit_lv2">연관 콘텐츠</div>
                    <div class="pagination pagenum5">
                        <a href="javascript:void(0);" class="swiper-button-prev">앞으로</a>
                        <a href="javascript:void(0);" class="swiper-button-next">뒤로</a>
                    </div> 
                </div>
                <div class="swiper swiper_type5">
                    <ul class="swiper-wrapper product_info product_list_evt">
                        ${promoList.map(slide => $QUI.Promo.COMP.PromoSlide(slide,'컨텐츠배너')).join('')}
                    </ul>
                </div>
            </section>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    const initSwiper = function(type){
        switch (type) {
            case 'BRAND':
                var swiper_br_dtl_02 = new Swiper(".swiper_br_dtl_02", {
                    slidesPerView: 3,
                    spaceBetween: 10,
                    slidesPerGroup: 3,
                    ally: false,
                    threshold: 0,
                    navigation: {
                        nextEl: ".swiper_br02 > .swiper-button-next",
                        prevEl: ".swiper_br02 > .swiper-button-prev",
                    },
                });
                break;
            case 'PRODUCT':
                var swiper5 = new Swiper(".swiper_type5", {
                    //상품상세 하단 연관콘텐츠
                    slidesPerView: 2,
                    spaceBetween: 10,
                    slidesPerGroup: 2,
                    threshold: 0,
                    ally: false,
                    navigation: {
                        nextEl: ".pagenum5 > .swiper-button-next",
                        prevEl: ".pagenum5 > .swiper-button-prev",
                    },
                });
            default:
                break;
        }
    };

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.initSwiper = initSwiper;
})(window.$QUI.Promo);