import React from "react";
import { useForm } from "react-hook-form";
import List from "./List";
import { default as api } from "../store/apiSlice";

export default function Form() {
  // using register, we can register input boxes
  // using handleSubmit, we can submit the data to the form (This function will receive the form data if form validation is successful.)
  // using resetFild, we can the reset the individual input boxes in forms.
  //   using only reset, will reset whole form once
  const { register, handleSubmit, resetField } = useForm();
  const [addTransaction] = api.useAddTransactionMutation();

  const onSubmit = async (data) => {
    if (!data) return {};
    await addTransaction(data).unwrap();
    resetField("name");
    resetField("amount");
  };

  return (
    <div className="form max-w-sm mx-auto w-96">
      <h1 className="font-bold pb-4 text-xl">Transaction</h1>

      {/* when the form has been submitted, we use handleSubmit, in which we are using onSubmit */}
      {/* onSubmit is simply taking the data from the form  */}
      <form id="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="input-group">
            <input
              type="text"
              {...register("name")} // usning register here to register the data from the corresponding input boxes
              placeholder="Salary, Business, Rent..."
              className="form-input"
            />
          </div>
          <select className="form-input" {...register("type")}>
            <option value="Investment" defaultValue>
              Investment
            </option>
            <option value="Expense">Expense</option>
            <option value="Savings">Savings</option>
          </select>
          <div className="input-group">
            <input
              type="text"
              {...register("amount")}
              placeholder="Amount"
              className="form-input"
            />
          </div>
          <div className="submit-btn">
            <button className="border py-2 text-white bg-indigo-500 w-full">
              Check Transaction
            </button>
          </div>
        </div>
      </form>

      <List></List>
    </div>
  );
}
