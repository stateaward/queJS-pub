((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.ProductList = (html) => {
        const isExist = html.length > 50;
        return  `
            ${isExist ? `
                <ul class="product_info product_list unfold">
                    ${html}
                </ul>
            ` : `
                <div class="no_data mt_40 product_list_nodata">
                    검색 결과가 없습니다.
                </div>
            `}
        `;
    };
    
    exp.COMP.ProductCountArea = (count) => {
        const cntNum = Number(count);
        const cntText = (cntNum > 100000) ? '100,000+' : cntNum.toLocaleString('ko-KR'); // 3자리 콤마
    
        return  `
            <p class="txt_result">${cntText}개의 상품이 있습니다.</p>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
})(window.$QUI.Misc);