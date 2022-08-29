function deleteItem(productId){
    $("#productId").val(productId)
    $("#deleteItemForm").submit()
}

function addToCart(productId,productName,ProductPrice){
    $("#cartProductId").val(productId)
    $("#cartProductName").val(productName)
    $("#cartProductPrice").val(ProductPrice)
    $("#addToCartForm").submit()
}