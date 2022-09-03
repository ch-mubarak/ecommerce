
$(window).on('load', async function () {
  try {
    const response = await axios({
      method: "get",
      url: `/user/wishlistCount`,
    })
    $(".wishlist-count").html(response.data.count)
  } catch (err) {
    console.error(err)
  }
})

async function wishlist(name, id) {
  try {
    const response = await axios({
      method: 'put',
      url: `/user/wishlist/${id}`,
      data: {
        name: name,
      }
    });
    $(".wishlist-count").html(response.data.count)
    console.log(response);
  } catch (error) {
    window.location.replace("/user/wishlist")
    console.error(error);
  }
}
