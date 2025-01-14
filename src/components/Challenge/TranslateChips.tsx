import { Typography } from '@mui/material';
import { FunctionComponent, useState, useCallback, useMemo } from 'react';

import { ChallengeType } from './types';
import { ChipsAndLines } from '@components/Chips/ChipsAndLines';
import { CheckAnswerControl } from '@components/CheckAnswerControl/CheckAnswerControl';
import { I18N, I18NLangs } from '@components/I18N/I18N';
import { isCorrectAnswer, prepareAnotherAnswer } from './utils';

export interface TranslateChipsData {
    sentence: string;
    answer: string[];
    chips: string[];
}

export interface TranslateChipsChallenge {
    type: ChallengeType.TRANSLATE_CHIPS;
    data: TranslateChipsData;
}

export interface TranslateChipsProps {
    challenge: TranslateChipsChallenge;
    onComplete({ solved }: { solved: boolean }): void;
}

export const TranslateChips: FunctionComponent<TranslateChipsProps> = ({
    challenge: { data },
    onComplete,
}) => {
    const [answerChips, setAnswerChips] = useState<string[]>([]);

    const checkAnswer = useCallback(() => {
        console.log(`Answer chips: ${answerChips}`, answerChips);

        return isCorrectAnswer(data.answer, answerChips);
    }, [data, answerChips]);

    const expectedAnswer = data.answer[0];
    const anotherAnswer = useMemo(() => {
        return prepareAnotherAnswer(data.answer, answerChips);
    }, [data, answerChips]);

    return (
        <div>
            <Typography variant="h5" color="primary" gutterBottom>
                <I18N textKey="translate-chips-prompt" lang={I18NLangs.RU} />
            </Typography>

            <Typography variant="h5" mb={2}>
                {data.sentence}
            </Typography>

            <ChipsAndLines chips={data.chips} onChange={setAnswerChips} />

            <CheckAnswerControl
                onSubmit={onComplete}
                checkAnswer={checkAnswer}
                expectedAnswer={expectedAnswer}
                anotherAnswer={anotherAnswer}
            />
        </div>
    );
};
