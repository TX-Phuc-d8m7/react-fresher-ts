import AdminDashBoard from "@/components/admin/admin_dashboard";
import { FilterTwoTone, ReadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, GetProp, InputNumber, Rate, Row, Tabs } from "antd";
import form from "antd/lib/form";

const HomePage = () => {
  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  const items = [
    { key: '1', label: 'Pho bien', children: <></> },
    { key: '2', label: 'Hang moi', children: <></> },
    { key: '3', label: 'Gia thap toi cao', children: <></> },
    { key: '4', label: 'Gia cao toi thap', children: <></> },

  ]
  return (
    <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
      <Row gutter={[20, 20]}>
        <Col md={4} sm={0} xs={0} style={{ border: "1px solid #ebebeb" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span> <FilterTwoTone />Bộ lọc tìm kiếm</span>
            {/* <ReadOutlined title="Reset" onClick={() => form.resetFields()}></ReadOutlined> */}
          </div>
          <Form
          // onFinish={onFinish}
          // form={form}
          // onValuesChange={(changedValues, values) => handleChangeFilter}
          >
            <Form.Item name="category" label="Danh muc san pham" labelCol={{ span: 24 }}>
              <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                <Row>
                  <Col span={8}>
                    <Checkbox value="A">A</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="B">B</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="C">C</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="D">D</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="E">E</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Divider />

            <Form.Item
              label="Khoang gia"
              labelCol={{ span: 24 }}>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form.Item name={["range", "from"]}>
                  <InputNumber
                    name='from'
                    min={0}
                    placeholder="d Tu"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
                <span>-</span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber
                    name='to'
                    min={0}
                    placeholder="d Den"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                  <Button

                  ></Button>

                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item
              label="Danh gia"
              labelCol={{ span: 24 }}
            >
              <div>
                <Rate value={5} disabled style={{ color: 'ffce3d' }}></Rate>
                <span className="ant-rate-text"></span>
              </div>
              <div>
                <Rate value={4} disabled style={{ color: 'ffce3d' }}></Rate>
                <span className="ant-rate-text">Trở lên</span>
              </div>
              <div>
                <Rate value={3} disabled style={{ color: 'ffce3d' }}></Rate>
                <span className="ant-rate-text">Trở lên</span>
              </div>
              <div>
                <Rate value={2} disabled style={{ color: 'ffce3d' }}></Rate>
                <span className="ant-rate-text">Trở lên</span>
              </div>
              <div>
                <Rate value={1} disabled style={{ color: 'ffce3d' }}></Rate>
                <span className="ant-rate-text">Trở lên</span>
              </div>
            </Form.Item>

          </Form>
        </Col>
        <Col md={20} xs={24} style={{ border: "1px solid red" }}>
          <Row>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;

