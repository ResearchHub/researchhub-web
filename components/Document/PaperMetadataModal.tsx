import { Paper } from "~/components/Document/lib/types";
import BaseModal from "../Modals/BaseModal";
import { useState } from "react";
import FormInput from "../Form/FormInput";
import { css, StyleSheet } from "aphrodite";
import Button from "../Form/Button";
import { formatDateStandard } from "~/config/utils/dates";
import HorizontalTabBar, { Tab } from "../HorizontalTabBar";
import PaperPageAbstractSection from "../Paper/abstract/PaperPageAbstractSection";
import { MessageActions } from "~/redux/message";
import { useDispatch } from "react-redux";
import colors from "~/config/themes/colors";
import API, { generateApiUrl } from "~/config/api";
import Helpers from "~/config/api/helpers";
import dayjs from 'dayjs';
import { ID } from "~/config/types/root_types";
import useCacheControl from "~/config/hooks/useCacheControl";
const { setMessage, showMessage } = MessageActions;


export const updatePaperMetadataAPI = async ({
  id,
  title,
  doi,
  publishedDate,
}: {
  id: ID;
  title?: string;
  doi?: string;
  publishedDate: string;
}) => {
  const url = generateApiUrl(`paper/${id}`);
  const response = await fetch(
    url,
    API.PATCH_CONFIG({
      ...(title && { title }),
      ...(doi && { doi }),
      ...(publishedDate && { published_date: publishedDate }),
    })
  ).then((res): any => Helpers.parseJSON(res));

  return Promise.resolve(response);
};

interface Props {
  paper: Paper;
  children: any;
  onUpdate?: Function;
}

interface FormProps {
  paper: Paper;  
}

const tabs:Array<Tab> = [{
  label: 'Metadata',
  value: 'metadata',
}, {
  label: 'Abstract',
  value: 'abstract',
}]


const PaperMetadataForm = ({ paper }: FormProps) => {
  const [fields, setFields] = useState({
    doi: paper.doi || '',
    publishedDate: formatDateStandard(paper.publishedDate, "MM/DD/YYYY"),
    title: paper.title || ''
  });
  const [editedFields, setEditedFields] = useState(new Set());
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { revalidateDocument } = useCacheControl();

  const validate = (name, value) => {
    if (name === "title") {
      return value.length >= 10
    }
    else if (name === "doi") {
      return value.length > 0;
    }
    else if (name === "publishedDate") {
      const parsedDate = dayjs(value, 'MM/DD/YYYY');
      return parsedDate.isValid() && value === parsedDate.format('MM/DD/YYYY');
    }
  }
  const handleSubmit = (e) => {
    const errors = {}
    if (editedFields.has("title") && !validate("title", fields["title"])) {
      errors["title"] = "Title must be at least 10 characters";
    }
    if (editedFields.has("publishedDate") && !validate("publishedDate", fields["publishedDate"])) {
      errors["publishedDate"] = "Enter a valid date in the format MM/DD/YYYY";
    }
    if (editedFields.has("doi") && !validate("doi", fields["doi"])) {
      errors["doi"] = "Enter a valid DOI";
    }

    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    updatePaperMetadataAPI({
      id: paper.id,
      title: fields.title,
      doi: fields.doi,
      publishedDate: fields.publishedDate
    }).then(() => {
      revalidateDocument();
      dispatch(setMessage("Paper updated"));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: false }));      
    })
  }

  const handleChange = (name, value) => {
    if (!editedFields.has(name)) {
      setEditedFields(prev => new Set(prev).add(name));
    }

    if (errors[name]) {
      if (validate(name, value)) {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }

    setFields(prev => ({
      ...prev,
      [name]: value
    }));
  };


  return (
    <div className={css(formStyles.formWrapper)}>
      <FormInput
        label="Title"
        placeholder="Original title of the paper"
        containerStyle={formStyles.container}
        inputStyle={formStyles.inputStyle}
        error={errors["title"]}
        value={fields.title}
        id="title"
        onChange={handleChange}
      />
      <FormInput
        label="DOI"
        placeholder="Unique DOI identifier"
        containerStyle={formStyles.container}
        inputStyle={formStyles.inputStyle}
        error={errors["doi"]}
        value={fields.doi}
        id="doi"
        onChange={handleChange}
      />
      <FormInput
        label="Published Date (MM/DD/YYYY)"
        placeholder="Date which paper was published"
        error={errors["publishedDate"]}
        containerStyle={formStyles.container}
        inputStyle={formStyles.inputStyle}
        value={fields.publishedDate}
        id="publishedDate"
        onChange={handleChange}
      />      

      <Button
        onClick={handleSubmit}
        label="Save changes"
        type="submit"
      />
    </div>
  )
}



const PaperMetadataModal = ({ paper, children, onUpdate }: Props ) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const _tabs = tabs.map(tab => ({...tab, isSelected: tab.value === activeTab}));
  const dispatch = useDispatch();
  
  return (
    <div>
      <BaseModal
        modalStyle={modalStyles.modalStyle}
        closeModal={() => {
          setIsOpen(false);
        }}
        isOpen={isOpen}
        title={`Edit Paper`}
      >
        <div className={css(modalStyles.bodyWrapper)}>
          <div className={css(modalStyles.tabsWrapper)}>
            <HorizontalTabBar tabs={_tabs} onClick={(tab) => setActiveTab(tab.value)} />
          </div>
          <div className={css(modalStyles.tabContentWrapper, activeTab === "abstract" && modalStyles.tabContentWrapperActive)}>
            <PaperPageAbstractSection
              paper={paper.raw}
              permanentEdit={true}
              onUpdate={(updated) => {
                dispatch(setMessage("Abstract updated"));
                // @ts-ignore
                dispatch(showMessage({ show: true, error: false }));
                setIsOpen(false);
                onUpdate && onUpdate(updated);
              }}
            />
          </div>
          <div className={css(modalStyles.tabContentWrapper, activeTab === "metadata" && modalStyles.tabContentWrapperActive)}>
            <PaperMetadataForm paper={paper} />
          </div>
        </div>
      </BaseModal>
      <div onClick={() => {
        setActiveTab(tabs[0].value);
        setIsOpen(true);
      }}>
        {children}
      </div>
    </div>
  )
}

const formStyles = StyleSheet.create({
  container: {
    // width: "100%",
  },
  inputStyle: {
    // width: "100%",
  },
  formWrapper: {
    width: "100%",
  },
  tagLabel: {
    color: colors.NEW_BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },    
  }
});

const modalStyles = StyleSheet.create({
  modalStyle: {
    width: 850,
  },
  bodyWrapper: {
    width: "100%",
    marginTop: 45,
  },
  tabContentWrapper: {
    display: "none",
    maxHeight: 400,
    overflowY: "scroll",
    padding: 10,
  },
  tabContentWrapperActive: {
    display: "block",
  },
  tabsWrapper: {
    // width: "100%",
    borderBottom: "2px solid #E5E5E5",
  }
})

export default PaperMetadataModal;