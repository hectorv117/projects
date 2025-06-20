import { render, fireEvent } from '@testing-library/react'
import Search from './Search'

it("searchRenderCheck", ()=>{
    const { queryByTitle } = render(<Search/>)
    const input = queryByTitle('resMsg')
    expect(input).toBeTruthy();
});