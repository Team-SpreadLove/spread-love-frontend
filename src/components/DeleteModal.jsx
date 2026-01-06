import Button from "./Button";

const DeleteModal = () => {
  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center">
      <div className="absolute inset-0 bg-sl-black/85"></div>
      <div className="relative w-full m-3 p-6 bg-sl-white border-3 border-sl-blue rounded-2xl shadow-2xl">
        <h2 className="mb-2 text-xl font-bold text-sl-black">기록 삭제</h2>
        <p className="mb-6 text-base font-semibold text-sl-black">
          이 채팅을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
        </p>
        <div className="flex justify-end gap-3">
          <Button bgColor="bg-sl-white" borderColor="border-sl-blue">
            취소
          </Button>
          <Button bgColor="bg-sl-red" borderColor="border-sl-red" textColor="text-sl-white">
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
