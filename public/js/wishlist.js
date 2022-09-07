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
    const response = await axios({
      method: 'put',
      url: `/user/wishlist/${id}`,
      data: {
        name: name,
      }
    });
    window.location.reload()
    console.log(response);
  } catch (error) {
    window.location.replace("/user/wishlist")
    console.error(error);
  }
}
