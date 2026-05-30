import "./Filter.css";
const Filter = ({ specialtyData, handleFilterDocterSpecialty }) => {
  return (
    <select
      defaultValue=""
      className="filter-specialty"
      onChange={(e) => handleFilterDocterSpecialty(e.target.value)}
    >
      <option value="">Chuyên khoa</option>
      {specialtyData?.map((specialty, index) => (
        <option key={index} value={specialty.idspecital}>
          {specialty.name}
        </option>
      ))}
    </select>
  );
};
export const FilterAll = ({ handleFilterDocterHocHam, data }) => {
  return (
    <select
      defaultValue=""
      className="filter-specialty"
      onChange={(e) => handleFilterDocterHocHam(e.target.value)}
    >
      {data.map((i) => (
        <option value={i.value} key={i.id}>
          {i.name}
        </option>
      ))}
    </select>
  );
};

export const SelectCpm = ({ClinicRef, data = [], value, onChange,className  }) => {
  const isEmpty = data.length === 0;

  return (
    <select
      ref={ClinicRef}
      value={value}
      onChange={onChange}
      defaultValue=""
      className={`user-filter-specialty ${className || ""}`}
    >
      <option value="" disabled>
        Vui lòng chọn phòng khám
      </option>

      {isEmpty ? (
        <option value="" disabled>
          Hiện chưa có phòng khám nào.
        </option>
      ) : (
        data.map((clinic, index) => (
          <option value={clinic.maPhongKham} key={index}>
            {clinic.tenPhongKham}
          </option>
        ))
      )}
    </select>
  );
};
export default Filter;
