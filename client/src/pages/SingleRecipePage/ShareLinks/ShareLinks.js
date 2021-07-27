import React from "react"
import { ListGroup } from "react-bootstrap"
import { RiWhatsappFill } from "react-icons/ri"
import { FaFacebook } from "react-icons/fa"
import styles from "./ShareLinks.module.scss"

const ShareLinks = ({ title }) => {
  const titleSliceForLink =
    title.length > 38 && title.slice(0, 38).replaceAll(" ", "-")
  return (
    <ListGroup className="list-group-horizontal  ">
      <li className={styles["link-item"]}>
        <p>שתפו:</p>
      </li>
      <li className={styles["link-item"]}>
        <a
          style={{ color: "#25D366" }}
          className="whatsapp"
          rel="noreferrer"
          target="_blank"
          href={`https://api.whatsapp.com/send?text=פודי: ${title} https://www.foody.co.il/foody_recipe/${titleSliceForLink}utm_source%3DWhatsapp%26utm_medium%3DMessenger%26utm_campaign%3DShare_Button`}
        >
          <RiWhatsappFill />
        </a>
      </li>

      <li className={styles["link-item"]}>
        <a
          className="facebook"
          target="_blank"
          rel="noreferrer"
          href={`https://www.facebook.com/sharer/sharer.php?u=https://www.foody.co.il/foody_recipe/${titleSliceForLink}`}
        >
          <FaFacebook />
        </a>
      </li>
    </ListGroup>
  )
}

export default ShareLinks
