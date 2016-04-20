// delete duplicate bookmarks

var allBookmarks = [];

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').addEventListener('click', function () {
        // do something when click the button
        no_duplicate();
    });
});

function no_duplicate() {
    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
        traverse_dir(bookmarkTreeNodes);
    });
}

function traverse_dir(bookmarkTreeNodes) {
    for (var i = 0; i < bookmarkTreeNodes.length; i++) {
        if (is_dir(bookmarkTreeNodes[i])) {
            // if this node is dir then traverse it
            var title = bookmarkTreeNodes[i].title;
            chrome.bookmarks.getChildren(bookmarkTreeNodes[i].id, function (nodes) {
                console.log("bookmarkTreeNode " + title + " is dir, has " + nodes.length + " items");
                traverse_dir(nodes);
            });
        } else {
            allBookmarks.push(bookmarkTreeNodes[i]);
            console.log(":" + bookmarkTreeNodes[i].title);
        }
    }
    console.log("you have " + allBookmarks.length + " bookmarks!");
}

function is_dir(bookmarkTreeNode) {
    // dir has no url
    return !bookmarkTreeNode.url;
}
