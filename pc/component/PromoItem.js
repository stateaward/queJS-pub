((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.PromoItem = (promo)=>{
        const escpStr = GPGA.escpQt(promo.title);
        
        return `
            <li data-event-name="${promo.subTitle}">
                <a href="${promo.link}" class="link_wrap">
                    <div class="thumb_area">
                        <span class="thumb"><img img="" onerror="imgErr(this)" src="${promo.imageUrl}" alt="${promo.title}"></span>
                        <div class="badge_wrap">
                            ${promo.isTimerBadge == 'Y' ? $QUI.Promo.COMP.PromoTimeBadge(promo) : ''}
                            ${isArrayNull(promo.badge) ? '' : 
                                promo.badge.map(badgeNm => $QUI.Promo.COMP.PromoBadge(badgeNm)).join('')
                            }
                        </div>
                    </div>
                </a>
                <div class="info_area contents">
                    <span class="cont_tit"><a href="javascript:void(0);">${promo.title}</a></span>
                    <span class="cont_subtit"><a href="javascript:void(0);">${promo.subTitle}</a></span>
                    <span class="cont_subdate">
                        <a href="javascript:void(0);">
                        ${convertDate(promo.startDate)} ~ ${convertDate(promo.endDate)}
                        </a>
                    </span>
                    ${isArrayNull(promo.tags) ? '' : `
                    <p class="badge_auto_list">
                        ${promo.tags.map(tagNm => $QUI.Promo.COMP.PromoTag(tagNm)).join('')}
                    </p>
                    `}
                    </div>
            </li>
        `;
    };
    
    exp.COMP.PromoTimeBadge = (promo)=>{
        return `
            <span class="badge orange" data-event-start-time="${promo.startDate}" data-event-end-time="${promo.endDate}"></span>
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