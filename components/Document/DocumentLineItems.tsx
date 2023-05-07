import { StyleSheet, css } from "aphrodite";
import { TopLevelDocument } from "~/config/types/root_types";
import AuthorList from "../Author/AuthorList";

const DocumentLineItems = ({ document }: { document: TopLevelDocument }) => {
  return (
    <div>
      <div className={css(styles.wrapper)}>
        <div className={css(styles.item)}>
          <div className={css(styles.title)}>Authors</div>
          <div className={css(styles.value)}>
            <AuthorList authors={document.authors} />
          </div>
        </div>
      </div>
      
    </div>
  )
}

const styles = StyleSheet.create({
  wrapper: {

  },
  item: {
    display: "flex",
  },
  title: {

  },
  value: {

  }  
})

export default DocumentLineItems;