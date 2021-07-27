import React from "react"
import Pagination from "react-bootstrap/Pagination"
import styles from "./Paginate.module.scss"

const Paginate = ({
  onClick,
  pagesCount: { pagesCount },
  activePageNumber = 1,
}) => {
  const paginationItems = []
  for (let i = 1; i <= pagesCount; i++) {
    paginationItems.push(
      <Pagination.Item
        active={i === activePageNumber}
        key={i}
        onClick={() => onClick(i)}
      >
        {i}
      </Pagination.Item>
    )
  }
  return (
    <section className={styles["pagination-container"]}>
      <Pagination className={styles.pagination}>{paginationItems}</Pagination>
    </section>
  )
}

export default Paginate
