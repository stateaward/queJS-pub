((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
	// 브랜드관>주목할만한 이벤트
	exp.COMP.Promo = (promoList)=>{
		return `
			<section class="section_block100">
				<h2 class="tit_type1">
					<p>주목할만한 이벤트</p>
				</h2>
	
				<div class="swiper swiper_type5 inner_left">
					<ul class="swiper-wrapper product_list_evt product_info">
						${promoList.map(slide => $QUI.Promo.COMP.PromoSlide(slide,'브랜드_이벤트')).join('')}
					</ul>
				</div>
			</section>
		`;
	};
	
	// 상품 상세>연관기획전
	exp.COMP.PromoProductDetail = (promoList)=>{
		return `
			<section class="no_bt">
				<div class="prd_subtit">연관 콘텐츠</div>
				<div class="swiper swiper_type5 inner_left">
					<ul class="swiper-wrapper product_list_evt product_info">
					${promoList.map(slide => $QUI.Promo.COMP.PromoSlide(slide,'컨텐츠배너')).join('')}
					</ul>
				</div>
			</section>
		`;
	};

	exp.COMP.PromoSlide = (slide, ga_label)=>{
		const escpStr = GPGA.escpQt(slide.title);
		
		return `
			<li class="swiper-slide">
				<div class="thumb_area">
						<a class="link_wrap" href="${slide.link}" onclick="GPGA.EVENT.setLabel('${escpStr}', '${ga_label}');">
								<span class="thumb"><img onerror="imgErr(this)" src="${slide.imageUrl}?RS=640" alt=""></span>
								<div class="badge_wrap">
									${slide.isTimerBadge == 'Y' ? $QUI.Promo.COMP.PromoTimeBadge(slide) : ''}
									${isArrayNull(slide.badge) ? '' : 
										slide.badge.map(badgeNm => $QUI.Promo.COMP.PromoBadge(badgeNm)).join('')
									}
								</div>
						</a>
				</div>
				<div class="info_area contents">
						<span class="cont_tit"><a href="${slide.link}" onclick="GPGA.EVENT.setLabel('${escpStr}', '${ga_label}');">${slide.title}</a></span>
						<span class="cont_subtit"><a href="${slide.link}" onclick="GPGA.EVENT.setLabel('${escpStr}', '${ga_label}');">${slide.subTitle}</a></span>
						<span class="cont_subdate">
							<a href="${slide.link}">${convertDate(slide.startDate)} ~ ${convertDate(slide.endDate)}</a>
						</span>
						${isArrayNull(slide.tags) ? '' : `
						<p class="badge_auto_list">
							${slide.tags.map(tagNm => $QUI.Promo.COMP.PromoTag(tagNm)).join('')}
						</p>
						`}
				</div>
			</li>
		`;
	};
	
	exp.COMP.PromoTimeBadge = (slide)=>{
		return `
			<span class="badge orange" data-event-start-time="${slide.startDate}" data-event-end-time="${slide.endDate}"></span>
		`;
	};
	
	exp.COMP.PromoBadge = (badgeNm)=>{
		return `<span class="badge">${badgeNm}</span>`;
	};
	
	exp.COMP.PromoTag = (tagNm)=>{
		return `<a href="javascript:void(0);">${tagNm}</a>`;
	};

	/*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
	// [exports]
	const initSwiper = function(){
		var swiper5 = new Swiper('.swiper_type5', {
			slidesPerView: 1.2,
			spaceBetween: 8,
			freeMode: true,
			threshold: 0,
			ally: false,
		});
	};

	// [exports]
	const isArrayNull = function(array){
		return Array.isArray(array) && array.every(item => item === "");
	};
	
	const convertDate = function(date){
		return date.split(' ')[0]?.replaceAll('-','.');
	};

	/*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
	exp.initSwiper = initSwiper;
	exp.isArrayNull = isArrayNull;
})(window.$QUI.Promo);