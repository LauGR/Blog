function add(e) {
    if (confirm('Que voulez-vous faire ??')) {
        console.log('isCheck')
        console.log('confirmer')
    } else {
        console.log('isCheck')
        e.preventDefault()
        e.stopPropagation()
    }
}
let isCheck = document.querySelectorAll('.publish');
console.log(isCheck);
for (let i = 0; i < isCheck.length; i++) {
    isCheck[i].addEventListener('click', add);
}