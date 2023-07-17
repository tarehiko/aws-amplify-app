/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, Text, TextField } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { fetchByPath, validateField } from "./utils";
export default function MyForm(props) {
    const { onSubmit, onValidate, onChange, overrides, ...rest } = props;
    const initialValues = {
        Field0: "",
        Field1: ""
    };
    const [Field0, setField0] = React.useState(initialValues.Field0);
    const [Field1, setField1] = React.useState(initialValues.Field1);
    const [errors, setErrors] = React.useState({});
    const resetStateValues = () => {
        setField0(initialValues.Field0);
        setField1(initialValues.Field1);
        setErrors({});
    };
    const validations = {
        Field0: [],
        Field1: [
            { type: "LessThanNum", numValues: [120], validationMessage: "Maximum value is 120. Or you seem to live a lot longer..." },
            { type: "GreaterThanNum", numValues: [0], validationMessage: "The value must be greater than 0." }
        ]
    };
    const runValidationTasks = async (fieldName, currentValue, getDisplayValue) => {
        const value = currentValue && getDisplayValue ? getDisplayValue(currentValue) : currentValue;
        let validationResponse = validateField(value, validations[fieldName]);
        const customValidator = fetchByPath(onValidate, fieldName);
        if (customValidator) {
            validationResponse = await customValidator(value, validationResponse);
        }
        setErrors(errors => ({ ...errors, [fieldName]: validationResponse }));
        return validationResponse;
    };
    return (<Grid as="form" rowGap="15px" columnGap="15px" padding="20px" onSubmit={async (event) => {
            event.preventDefault();
            const modelFields = {
                Field0,
                Field1
            };
            const validationResponses = await Promise.all(Object.keys(validations).reduce((promises, fieldName) => {
                if (Array.isArray(modelFields[fieldName])) {
                    promises.push(...modelFields[fieldName].map(item => runValidationTasks(fieldName, item)));
                    return promises;
                }
                promises.push(runValidationTasks(fieldName, modelFields[fieldName]));
                return promises;
            }, []));
            if (validationResponses.some(r => r.hasError)) {
                return;
            }
            await onSubmit(modelFields);
        }} {...getOverrideProps(overrides, "MyForm")} {...rest}><Text children="Plese input your name " {...getOverrideProps(overrides, "SectionalElement0")}></Text><TextField label="Name" placeholder="Input your name..." value={Field0} onChange={e => {
            let { value } = e.target;
            if (onChange) {
                const modelFields = {
                    Field0: value,
                    Field1
                };
                const result = onChange(modelFields);
                value = result?.Field0 ?? value;
            }
            if (errors.Field0?.hasError) {
                runValidationTasks("Field0", value);
            }
            setField0(value);
        }} onBlur={() => runValidationTasks("Field0", Field0)} errorMessage={errors.Field0?.errorMessage} hasError={errors.Field0?.hasError} {...getOverrideProps(overrides, "Field0")}></TextField><Text children="Tell me your age" {...getOverrideProps(overrides, "SectionalElement1")}></Text><TextField label="Age" placeholder="Input your age..." type="number" step="any" value={Field1} onChange={e => {
            let { value } = e.target;
            if (onChange) {
                const modelFields = {
                    Field0,
                    Field1: value
                };
                const result = onChange(modelFields);
                value = result?.Field1 ?? value;
            }
            if (errors.Field1?.hasError) {
                runValidationTasks("Field1", value);
            }
            setField1(value);
        }} onBlur={() => runValidationTasks("Field1", Field1)} errorMessage={errors.Field1?.errorMessage} hasError={errors.Field1?.hasError} {...getOverrideProps(overrides, "Field1")}></TextField><Flex justifyContent="space-between" {...getOverrideProps(overrides, "CTAFlex")}><Button children="Clear" type="reset" onClick={(event) => {
            event.preventDefault();
            resetStateValues();
        }} {...getOverrideProps(overrides, "ClearButton")}></Button><Flex gap="15px" {...getOverrideProps(overrides, "RightAlignCTASubFlex")}><Button children="Submit" type="submit" variation="primary" isDisabled={Object.values(errors).some(e => e?.hasError)} {...getOverrideProps(overrides, "SubmitButton")}></Button></Flex></Flex></Grid>);
}
