import streamlit as st
import pandas as pd
import numpy as np

# 页面设置
st.set_page_config(page_title="甘肃招标代理业务看板", layout="wide")

st.title("🚀 招标业务线上化转型监控")
st.subheader("5人核心团队任务执行状态")

# 模拟数据：各项目进度
chart_data = pd.DataFrame(
    np.random.randn(20, 3),
    columns=['电子标书制作', '在线开标模拟', '系统集成测试']
)

# 1. 核心指标统计
col1, col2, col3 = st.columns(3)
col1.metric("当月在线招标项目", "42 个", "12%")
col2.metric("核心团队负荷", "85%", "-5%")
col3.metric("省财政厅接口通畅度", "稳定", "99.9%")

# 2. 交互式侧边栏：筛选团队成员
with st.sidebar:
    st.header("管理筛选")
    member = st.selectbox("查看技术人员：", ["张三 (前端)", "李四 (后端)", "王五 (AI预审)", "赵六 (测试)", "孙七 (运维)"])
    st.write(f"当前正在查看 **{member}** 的工作流。")

# 3. 进度可视化
st.line_chart(chart_data)

# 4. 軟考知識點結合：干係人滿意度
st.divider()
st.subheader("🤝 干系人（业主/专家）满意度分析")
satisfaction = st.slider("当前项目平均满意度", 0, 100, 85)
if satisfaction < 60:
    st.error("警告：满意度低于及格线，请启动『干系人参与计划』！")
else:
    st.success("状态良好：继续保持沟通。")
