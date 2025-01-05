((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.PromoSlide = (slide, ga_label)=>{
        const escpStr = GPGA.escpQt(slide.title);
        
        return `
            <li class="swiper-slide">
                <a href="${slide.link}" class="link_wrap" onclick="GPGA.EVENT.setLabel('${escpStr}','${ga_label}');">							
                    <div class="thumb_area">
                        <span class="thumb"><img onerror="imgErr(this)" src="${slide.imageUrl}" alt=""></span>
                        <div class="badge_wrap">
                            ${slide.isTimerBadge == 'Y' ? $QUI.Promo.COMP.PromoTimeBadge(slide) : ''}
                            ${isArrayNull(slide.badge) ? '' : 
                                slide.badge.map(badgeNm => $QUI.Promo.COMP.PromoBadge(badgeNm)).join('')
                            }
                        </div>
                    </div>
                    <div class="info_area contents">
                        <span class="cont_tit">${slide.title}</span>
                        <span class="cont_subtit">${slide.subTitle}</span>
                        <span class="cont_subdate">${convertDate(slide.startDate)} ~ ${convertDate(slide.endDate)}</span>
                        ${isArrayNull(slide.tags) ? '' : `
                        <p class="badge_auto_list">
                            ${slide.tags.map(tagNm => $QUI.Promo.COMP.PromoTag(tagNm)).join('')}
                        </p>
                        `}
                    </div>
                </a>
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
        return `<span class="hashtag">${tagNm}</span>`;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    const convertDate = function(date){
        return date.split(' ')[0]?.replaceAll('-','.');
    };

    // [exports]
    const isArrayNull = function(array){
        return Array.isArray(array) && array.every(item => item === "");
    };

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.isArrayNull = isArrayNull;
})(window.$QUI.Promo);