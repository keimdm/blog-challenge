const deletePostHandler = async (event) => {
    event.preventDefault();
    console.log("pressed delete post button");
    console.log
    const postID = Number(event.target.id);
    const response = await fetch(`/dashboard/post/${postID}/delete`, {
        method: 'DELETE',
    });
    if (response.ok) {
        console.log("ok");
        document.location.replace(`/dashboard`);
    } else {
        alert('Failed to delete post');
    }
}
  
  document.querySelector('.delete-button').addEventListener('click', deletePostHandler);