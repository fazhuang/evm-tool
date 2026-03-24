import streamlit as st
import pandas as pd

# 设置页面风格：高对比度/简约
st.set_page_config(page_title="软考EVM计算工具", layout="wide")

st.title("📊 项目挣值管理 (EVM) 绩效分析仪")
st.caption("适用场景：软考高项/中项计算题模拟 & 5人团队项目监控")

# 侧边栏：基础数值输入 (BAC 为总预算)
with st.sidebar:
    st.header("📌 基础参数设置")
    bac = st.number_input("项目总预算 (BAC)", value=100000)
    pv = st.number_input("计划值 (PV)", value=50000)
    ev = st.number_input("挣值 (EV)", value=45000)
    ac = st.number_input("实际成本 (AC)", value=55000)

# 核心公式计算
cv = ev - ac
sv = ev - pv
cpi = ev / ac if ac != 0 else 0
spi = ev / pv if pv != 0 else 0

# 典型与非典型 EAC 计算
eac_typical = bac / cpi if cpi != 0 else bac  # 典型偏差
eac_atypical = ac + (bac - ev)              # 非典型偏差

# 1. 核心指标看板
col1, col2, col3, col4 = st.columns(4)

with col1:
    color = "red" if cv < 0 else "green"
    st.metric("成本偏差 (CV)", f"{cv}", delta=cv, delta_color="normal")
    st.write(f":{color}[{'超支' if cv < 0 else '节省'}]")

with col2:
    color = "red" if sv < 0 else "green"
    st.metric("进度偏差 (SV)", f"{sv}", delta=sv, delta_color="normal")
    st.write(f":{color}[{'滞后' if sv < 0 else '提前'}]")

with col3:
    st.metric("成本绩效 (CPI)", f"{cpi:.2f}")
    st.progress(min(max(cpi/2, 0.0), 1.0))

with col4:
    st.metric("进度绩效 (SPI)", f"{spi:.2f}")
    st.progress(min(max(spi/2, 0.0), 1.0))

st.divider()

# 2. 软考难点：预测分析
st.subheader("🔮 完工预测 (Forecast)")
c_eac1, c_eac2 = st.columns(2)

with c_eac1:
    st.info("**典型偏差 (EAC)**")
    st.write("假设后续效率按当前执行：")
    st.title(f"¥ {int(eac_typical)}")
    st.caption("公式：BAC / CPI")

with c_eac2:
    st.warning("**非典型偏差 (EAC)**")
    st.write("假设后续效率回归计划：")
    st.title(f"¥ {int(eac_atypical)}")
    st.caption("公式：AC + (BAC - EV)")
