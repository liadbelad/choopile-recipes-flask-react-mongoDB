import React, { useState } from "react"
import {
  Form,
  FormControl,
  InputGroup,
  Button,
  Row,
  Col,
} from "react-bootstrap"
import SearchResults from "./SearchResults/SearchResults"

const SearchBar = ({ md, lg }) => {
  const [enteredKeyword, setEnteredKeyword] = useState("")

  const handleChangeSearchInput = (e) => {
    setEnteredKeyword(e.target.value)
  }

  return (
    <>
      <Form inline as={Row} className="w-100 m-0">
        <Col md={md} lg={lg} className="mx-auto p-0">
          <InputGroup className="mx-auto">
            <FormControl
              id="search-recipe"
              placeholder="מילות החיפוש שלך..."
              className="py-4"
              onChange={handleChangeSearchInput}
            />
            <InputGroup.Prepend>
              <Button variant="light" type="submit">
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup.Prepend>
          </InputGroup>
          <SearchResults md={md} lg={lg} enteredKeyword={enteredKeyword} />
        </Col>
      </Form>
    </>
  )
}

export default SearchBar
