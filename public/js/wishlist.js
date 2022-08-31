
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
    window.location.replace("/login")
    console.error(error);
  }
}
