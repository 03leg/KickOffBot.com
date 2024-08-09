import React from 'react';
import { Box, Link, Typography } from '@mui/material'
import UnknownUserLayout from '../UnknownUserLayout';

export default function TermsOfService() {
    return (
        <UnknownUserLayout>
            <Box sx={{  margin: '0 auto' }}>
                <Typography variant="h5" textAlign={'center'}>Website Terms and Conditions of Use</Typography>
                <ol>
                    <br/>
                    <li>
                        <Typography variant="body1">
                            <strong>Terms</strong>
                            <p>
                                By accessing this Website, accessible from{' '}
                                <Link href="https://kickoffbot.com">https://kickoffbot.com</Link>, you are agreeing to be
                                bound by these Website Terms and Conditions of Use and agree that you are responsible for
                                the agreement with any applicable local laws. If you disagree with any of these terms,
                                you are prohibited from accessing this site. The materials contained in this Website are
                                protected by copyright and trademark law.
                            </p>
                        </Typography>
                    </li>
                    <br/>
                    <li>
                        <Typography variant="body1">
                            <strong>Use License</strong>
                            <p>
                                Permission is granted to temporarily download one copy of the materials on KickOffBot&apos;s
                                Website for personal, non-commercial transitory viewing only. This is the grant of a
                                license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul>
                                <li>remove any copyright or other proprietary notations from the materials; or</li>
                                <li>
                                    transferring the materials to another person or &quot;mirror&quot; the materials on any other
                                    server.
                                </li>
                            </ul>
                            <p>
                                This will let KickOffBot to terminate upon violations of any of these restrictions. Upon
                                termination, your viewing right will also be terminated and you should destroy any
                                downloaded materials in your possession whether it is printed or electronic format. These
                                Terms of Service has been created with the help of the Terms Of Service Generator and the
                                Privacy Policy Generator.
                            </p>
                        </Typography>
                    </li>

                    <br/>
                    <li>
                        <Typography variant="body1">
                            <strong>Disclaimer</strong>
                            <p>
                                All the materials on KickOffBot&apos;s Website are provided &quot;as is&quot;. KickOffBot makes no
                                warranties, may it be expressed or implied, therefore negates all other warranties.
                                Furthermore, KickOffBot does not make any representations concerning the accuracy or
                                reliability of the use of the materials on its Website or otherwise relating to such
                                materials or any sites linked to this Website.
                            </p>
                        </Typography>
                    </li>
                    <br/>
                    <li>
                        <Typography variant="body1">
                            <strong>Limitations</strong>
                            <p>
                                KickOffBot or its suppliers will not be held accountable for any damages that will arise
                                with the use or inability to use the materials on KickOffBot&apos;s Website, even if KickOffBot
                                or an authorized representative of this Website has been notified, orally or written, of
                                the possibility of such damage. Some jurisdictions do not allow limitations on implied
                                warranties or limitations of liability for incidental damages, these limitations may not
                                apply to you.
                            </p>
                        </Typography>
                    </li>
                    <br/>
                    <li>
                        <Typography variant="body1">
                            <strong>Revisions and Errata</strong>
                            <p>
                                The materials appearing on KickOffBot&apos;s Website may include technical, typographical, or
                                photographic errors. KickOffBot will not promise that any of the materials in this Website
                                are accurate, complete, or current. KickOffBot may change the materials contained on its
                                Website at any time without notice. KickOffBot does not make any commitment to update the
                                materials.
                            </p>
                        </Typography>
                    </li>
                    <br/>
                    <li>
                        <Typography variant="body1">
                            <strong>Links</strong>
                            <p>
                                KickOffBot has not reviewed all of the sites linked to its Website and is not responsible
                                for the contents of any such linked site. The presence of any link does not imply
                                endorsement by KickOffBot of the site. The use of any linked website is at the user&apos;s own
                                risk.
                            </p>
                        </Typography>
                    </li>
                    <br/>
                    <li>
                        <Typography variant="body1">
                            <strong>Site Terms of Use Modifications</strong>
                            <p>
                                KickOffBot may revise these Terms of Use for its Website at any time without prior notice.
                                By using this Website, you are agreeing to be bound by the current version of these Terms
                                and Conditions of Use.
                            </p>
                        </Typography>
                    </li>
                    <br/>
                    <li>
                        <Typography variant="body1">
                            <strong>Prohibition of Scam KickOffBots</strong>
                            <p>
                                You agree not to create or use KickOffBots on KickOffBot&apos;s Website for the purpose of
                                engaging in fraudulent activities, scamming individuals, or any other unethical or illegal
                                activities. This includes but is not limited to KickOffBots designed to deceive, defraud,
                                or mislead people for financial gain or personal benefit. KickOffBot reserves the right to
                                take appropriate action, including the termination of any user account, if it determines
                                that a KickOffBot is being used in violation of this provision.
                            </p>
                        </Typography>
                    </li>
                    <br/>
                    <li>
                        <Typography variant="body1">
                            <strong>Your Privacy</strong>
                            <p><Link href="https://kickoffbot.com/privacy-policy">Please read our Privacy Policy.</Link></p>
                        </Typography>
                    </li>
                    <br/>
                    <li>
                        <Typography variant="body1">
                            <strong>Governing Law</strong>
                            <p>
                                Any claim related to KickOffBot&apos;s Website shall be governed by the laws of fr without
                                regards to its conflict of law provisions.
                            </p>
                        </Typography>
                    </li>
                </ol>
            </Box>
        </UnknownUserLayout>
    )
}
