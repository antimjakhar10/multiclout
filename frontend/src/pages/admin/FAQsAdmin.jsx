import AdminCrudPage from "../../components/admin/AdminCrudPage";

function FaqsAdmin() {
  return (
    <AdminCrudPage
      title="FAQs"
      endpoint="/faqs"
      itemLabel="FAQ"
      listKey="faqs"
      fields={[
        { name: "question", label: "Question", type: "text" },
        { name: "answer", label: "Answer", type: "textarea" },
      ]}
    />
  );
}

export default FaqsAdmin;