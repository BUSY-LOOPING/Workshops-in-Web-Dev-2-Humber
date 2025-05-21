function reverse(s) {
    reverse = ''
    for(let i = s.length-1; i >=0; i--) {
        reverse += s.charAt(i);
    }
    return reverse;
}

console.log(reverse('hello'));
