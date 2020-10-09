import React, { FC } from "react"
import { connect } from "react-redux";
// import classnames from "classnames";
// import { toFix } from "../utils/formatCurrency";
import { ExchangesState } from "../store/types";
import { Exchange } from "../types";

interface IBaseProps {
  className?: string;
}

interface IStateProps {
  exchange: Exchange;
  method: string;
  loading: boolean;
}

type IProps = IBaseProps & IStateProps;

const RateChart: FC<IProps> = (props: IProps) => {
  // const {
  //   className = "",
  //   exchange,
  //   method,
  //   loading,
  // } = props;

  return (
    <div className='reate-chart'>
      chart
    </div>
  );
};

export default connect(
  ({ exchange, loading, method }: ExchangesState) => ({
    exchange,
    loading,
    method
  })
)(RateChart);
