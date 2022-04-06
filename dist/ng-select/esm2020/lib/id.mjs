export function newId() {
    // First character is an 'a', it's good practice to tag id to begin with a letter
    return 'axxxxxxxxxxx'.replace(/[x]/g, () => {
        // eslint-disable-next-line no-bitwise
        const val = Math.random() * 16 | 0;
        return val.toString(16);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbmctc2VsZWN0L2xpYi9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLFVBQVUsS0FBSztJQUNqQixpRkFBaUY7SUFDakYsT0FBTyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7UUFDdkMsc0NBQXNDO1FBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gbmV3SWQoKSB7XHJcbiAgICAvLyBGaXJzdCBjaGFyYWN0ZXIgaXMgYW4gJ2EnLCBpdCdzIGdvb2QgcHJhY3RpY2UgdG8gdGFnIGlkIHRvIGJlZ2luIHdpdGggYSBsZXR0ZXJcclxuICAgIHJldHVybiAnYXh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beF0vZywgKCkgPT4ge1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXHJcbiAgICAgICAgY29uc3QgdmFsID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcclxuICAgICAgICByZXR1cm4gdmFsLnRvU3RyaW5nKDE2KTtcclxuICAgIH0pO1xyXG59XHJcbiJdfQ==