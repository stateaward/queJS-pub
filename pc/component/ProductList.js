((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.ProductCountArea = (count) => {
        const cntNum = Number(count);
        const cntText = (cntNum > 100000) ? '100,000+' : cntNum.toLocaleString('ko-KR'); // 3자리 콤마
    
        return  `
            <p class="txt_result">
                ${cntText}개의 상품이 있습니다.
            </p>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
})(window.$QUI.Misc);