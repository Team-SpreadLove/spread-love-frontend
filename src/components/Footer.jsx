import Button from "./Button";

const Footer = () => {
  return (
    <footer className="flex justify-end gap-x-2">
      <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
        저장
      </Button>
      <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
        삭제
      </Button>
      <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
        닫기
      </Button>
    </footer>
  );
};

export default Footer;
