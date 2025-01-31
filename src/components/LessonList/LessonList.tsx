import { FunctionComponent, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    LinearProgress,
    Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

import { Header } from '@components/Header/Header';
import { LessonDescription } from '@components/Lesson/Lesson';
import { I18N, I18NLangs } from '@components/I18N/I18N';
import { UserData, userDataApi } from '@api/user-data';
import { About } from '@components/About/About';

export interface LessonListProps {
    lessons: LessonDescription[];
    onLessonSelect(id: string): void;
}

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const Item = styled.div`
    margin-left: 20px;
    margin-bottom: 20px;
`;

const XP = styled.div`
    margin-left: auto;
`;

const EllipsisTypography = styled(Typography)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

function computeLessonProgress(
    userData: UserData | undefined,
    lessonId: string,
) {
    const lessonStats = userData?.lessons[lessonId];

    return lessonStats
        ? Math.min((lessonStats.completed / lessonStats.threshold) * 100, 100)
        : 0;
}

export const LessonList: FunctionComponent<LessonListProps> = ({
    lessons,
    onLessonSelect,
}) => {
    const [loadingState, setLoadingState] = useState<string>('loading');
    const [userData, setUserData] = useState<UserData>();

    useEffect(() => {
        console.log('LOG::LessonList.effect run');

        userDataApi
            .getUserData('default')
            .then((userData) => {
                setUserData(userData);
                setLoadingState('complete');
            })
            .catch((error) => {
                console.log('LOG::LessonList.effect failed to fetch', error);
            });

        return () => {
            console.log('LOG::LessonList.effect clean');
        };
    }, [setLoadingState, setUserData]);

    function handleLessonSelect(evt: React.MouseEvent<HTMLButtonElement>) {
        const lessonId = evt.currentTarget.getAttribute('data-lesson-id');

        if (typeof lessonId === 'string') {
            onLessonSelect(lessonId);
        } else {
            console.error('"data-lesson-id" attribute is missing');
        }
    }

    return (
        <div>
            <Header>
                <Typography variant="h4">
                    <I18N
                        textKey="lesson-list-heading"
                        lang={I18NLangs.RU}
                    ></I18N>
                </Typography>
                <XP>
                    <Typography variant="h4">
                        {' '}
                        <StarIcon
                            fontSize="inherit"
                            sx={{ marginBottom: '-5px' }}
                        />{' '}
                        {userData?.xp || 0}{' '}
                    </Typography>
                </XP>
            </Header>
            <Container>
                {loadingState === 'loading' && (
                    <CircularProgress
                        sx={{ marginLeft: 'auto', marginRight: 'auto' }}
                    />
                )}
                {loadingState === 'complete' &&
                    lessons.map((lesson) => (
                        <Item key={lesson.id}>
                            <Card
                                sx={{
                                    width: 230,
                                    minHeight: 180,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <EllipsisTypography
                                        variant="body1"
                                        gutterBottom
                                    >
                                        {lesson.displayTopic} &middot;{' '}
                                        {lesson.displayName}
                                    </EllipsisTypography>
                                    <LinearProgress
                                        variant="determinate"
                                        sx={{ marginBottom: 2 }}
                                        value={computeLessonProgress(
                                            userData,
                                            lesson.id,
                                        )}
                                    ></LinearProgress>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {lesson.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ flexShrink: 0 }}>
                                    <Button
                                        size="small"
                                        data-lesson-id={lesson.id}
                                        onClick={handleLessonSelect}
                                    >
                                        <I18N
                                            textKey="lesson-list-practice-button"
                                            lang={I18NLangs.RU}
                                        ></I18N>
                                    </Button>
                                </CardActions>
                            </Card>
                        </Item>
                    ))}

                <About />
            </Container>
        </div>
    );
};
