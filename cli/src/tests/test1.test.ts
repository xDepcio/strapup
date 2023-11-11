function xd(a: number) {
    return a + 2
}


test('xd', () => {
    expect(xd(2)).toBe(4)
})
