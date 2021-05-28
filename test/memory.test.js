it('should shuffle the colors', function(){
  let theColors = ['red','blue','green','orange','purple','red','blue','green','orange','purple'];
  let mixedColors = shuffle(COLORS);
  expect(mixedColors).not.toEqual(theColors);
});