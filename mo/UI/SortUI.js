(()=>{
    const dependency = [
        `component/Sort.js`
    ];

    // Sort
    $Que.initUI('Sort', dependency, ()=>{
        $QUI.Sort._sortDict = [
            {idx:1, cd:'GOD_BEST_POINT', korNm:'베스트순'},
            {idx:2, cd:'NEW_GOD_SEQ', korNm:'신상품순'},
            {idx:3, cd:'LWET_PRC_SEQ', korNm:'낮은 가격순'},
            {idx:4, cd:'BEST_PRC_SEQ', korNm:'높은 가격순'},
            {idx:5, cd:'BEST_DC_SEQ', korNm:'할인율순'},
            {idx:6, cd:'PCH_PS_SEQ', korNm:'리뷰순'},
            {idx:7, cd:'MD_RECOMMEND_SEQ', korNm:'추천순'},
        ];
        
        $QUI.Sort.initSort();
    });
})();