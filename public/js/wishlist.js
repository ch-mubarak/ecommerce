$(document).ready(async () => {
  try {
    const response = await axios.get("/user/wishlistItemCount")
    const itemCount = response.data.itemCount ? response.data.itemCount : 0
    $(".wishlist-item-count").html(itemCount)

  } catch (err) {
    console.error(err)
  }
})

async function wishlist(name, id) {
  try {
    document.getElementById("waiter").innerHTML =`<div class="waiting"></div>`
    const response = await axios({
      method: 'put',
      url: `/user/wishlist/${id}`,
      data: {
        name: name,
      }
    });
    document.getElementById("waiter").innerHTML =""
    if (response.status == 204) {
      let itemCount = Number($(".wishlist-item-count").html())
      itemCount -= 1
      $(".wishlist-item-count").html(itemCount)
      $(".heart-icon").css("color","#6f6f6f")
      toastr.options = { "positionClass": "toast-bottom-right" }
      toastr.info('Item removed from wishlist.')
    } else if (response.status == 201) {
      let itemCount = Number($(".wishlist-item-count").html())
      itemCount += 1
      $(".wishlist-item-count").html(itemCount)
      $(".heart-icon").css("color","rgb(219, 47, 47)")
      toastr.options = { "positionClass": "toast-bottom-right" }
      toastr.success('Item added to wishlist.')
    }
    console.log(response);
  } catch (error) {
    window.location.replace("/user/wishlist")
    console.error(error);
  }
}


async function removeFromWishlist(name, id) {
  try {
    const response = await axios({
      method: 'put',
      url: `/user/wishlist/${id}`,
      data: {
        name: name,
      }
    });
    if (response.status == 204) {
      let itemCount = Number($(".wishlist-item-count").html())
      itemCount -= 1
      if (itemCount != 0) {
        $(".wishlist-item-count").html(itemCount)
        document.getElementById(`wishlist-${id}`).remove()
        toastr.options = { "positionClass": "toast-bottom-right" }
        toastr.info('Item removed from wishlist.')
      } else {
        window.location.reload()
      }
    }
  } catch (err) {
    console.error(err)
  }
}
