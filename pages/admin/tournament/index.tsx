/**
 *
 * Able to create tournament for game
 */

import React from "react";
import { auth } from "../../../src/config/firebaseConfig";
import GetUserRole from "../../../src/functions/GetUserRoles";
import { withRouter } from "next/router";

import iTournament, {
  gameFormatType,
  gameModeType,
  playerType,
} from "../../../src/interfaces/iTournament";
import { WithRouterProps } from "next/dist/client/with-router";
import Markdown from "../../../src/components/Markdown";
import { gameIds, MainGameData } from "../../../src/data/mainGameData";
import CreatePrivateTournament from "../../../src/functions/TournamentHelper";
class AdminTournament extends React.Component<WithRouterProps, iTournament> {
  constructor(props: WithRouterProps) {
    super(props);
    //@ts-ignore
    this.state = {
      participates: 0,
      eventStartingDate: Date.now(),
      participationCloseDate: Date.now(),
      gameId: MainGameData[0].gameId,
      gameName: MainGameData[0].gameName,
      name: "",
      participationLimit: 0,
      prizePool: 0,
      tournamentRules: "",

      info: {
        mode: "standard",
        coach: "not allowed",
        format: "best of 3",
        overtime: "off",
        playerType: "4 man squad",
      },

      markdown: "",
    };
  }
  componentDidMount() {
    auth.onAuthStateChanged(async (user) => {
      if (user?.isAnonymous) {
        this.props.router.push("/");
      }
      if (user) {
        const user = await GetUserRole();
        if (user !== "admin") {
          this.props.router.push("/");
        }
      } else {
        this.props.router.push("/");
      }
    });
  }

  render() {
    return (
      <div className="mt-5">
        <div>
          <div className="flex justify-between">
            <div>
              <label>Name</label>

              <input
                value={this.state.name}
                className="border-box"
                onChange={(e) => this.setState({ name: e.target.value })}
              ></input>
            </div>
            <button
              className="btn btn--primary"
              onClick={async (e) => {
                await CreatePrivateTournament(this.state);
                this.props.router.back();
              }}
            >
              Create Tournament (Private)
            </button>
          </div>
          <div className="space-x-7 mb-2">
            <label>Game Name</label>
            <select
              value={this.state.gameName}
              onChange={(e) =>
                this.setState({
                  gameName: e.target.value,
                  gameId: MainGameData.find((obj) => {
                    return obj.gameName === e.target.value ? true : false;
                  })?.gameId as unknown as string,
                })
              }
            >
              {MainGameData.map((e, idx) => {
                return (
                  <option key={idx} value={e.gameName}>
                    {e.gameName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div>
          <hr></hr>
          <p>Tournament Info</p>
          <hr></hr>
          <div className="space-x-7 mb-2">
            <label>Mode</label>
            <select
              value={this.state.info.mode}
              onChange={(e) =>
                this.setState({
                  info: {
                    ...this.state.info,
                    mode: e.target.value as gameModeType,
                  },
                })
              }
            >
              <option value={"standard" as gameModeType}>standard</option>
              <option value={"battle royal" as gameModeType}>
                battle royal
              </option>
              <option value={"deathmatch" as gameModeType}>deathmatch</option>
              <option value={"spike" as gameModeType}>spike</option>
            </select>
          </div>
          <div className="space-x-7 mb-2">
            <label>overtime</label>
            <input
              type="checkbox"
              onChange={(e) => {
                this.setState({
                  info: {
                    ...this.state.info,
                    overtime: e.target.checked ? "on" : "off",
                  },
                });
              }}
            ></input>
          </div>
          <div className="space-x-7 mb-2">
            <label>Coach</label>
            <input
              onChange={(e) => {
                this.setState({
                  info: {
                    ...this.state.info,
                    coach: e.target.checked ? "allowed" : "not allowed",
                  },
                });
              }}
              type="checkbox"
            ></input>
          </div>
          <div className="space-x-7 mb-2">
            <label>Format(Only for 5v5)</label>
            <select
              value={this.state.info.format}
              onChange={(e) =>
                this.setState({
                  info: {
                    ...this.state.info,
                    format: e.target.value as gameFormatType,
                  },
                })
              }
            >
              <option value={"NA" as gameFormatType}>NA</option>
              <option value={"best of 1" as gameFormatType}>best of 1</option>
              <option value={"best of 3" as gameFormatType}>best of 3</option>
              <option value={"best of 5" as gameFormatType}>best of 5</option>
            </select>
          </div>
          <div className="space-x-7 mb-2">
            <label>Player Type</label>
            <select
              value={this.state.info.playerType}
              onChange={(e) =>
                this.setState({
                  info: {
                    ...this.state.info,
                    playerType: e.target.value as playerType,
                  },
                })
              }
            >
              <option value={"solo" as playerType}>solo</option>
              <option value={"duo" as playerType}>duo</option>
              <option value={"3 man squad" as playerType}>3 man squad</option>
              <option value={"4 man squad" as playerType}>4 man squad</option>
              <option value={"team" as playerType}>team</option>
            </select>
          </div>
          <div className="space-x-7 mb-2">
            <label>Clan(submittion only from clan)</label>
            <input
              onChange={(e) => {
                this.setState({
                  participatesList: [],
                });
              }}
              type="checkbox"
            ></input>
          </div>
          <div className="space-x-7 mb-2">
            <label>participates Limit(4 teams | 10 players)</label>
            <input
              type="text"
              value={this.state.participationLimit}
              onChange={(e) =>
                this.setState({
                  participationLimit: Number(e.target.value),
                })
              }
            ></input>
          </div>
          <div className="space-x-7 mb-2">
            <label>Prize Pool</label>
            <input
              value={this.state.prizePool}
              onChange={(e) =>
                this.setState({
                  prizePool: Number(e.target.value),
                })
              }
              type="text"
            ></input>
          </div>
          <div className="space-x-7 mb-2">
            <label>participation close date</label>
            <input
              value={new Date(this.state.participationCloseDate)
                .toISOString()
                .slice(0, 10)}
              onChange={(e) => {
                this.setState({
                  participationCloseDate: new Date(e.target.value).getTime(),
                });
              }}
              type="date"
            ></input>
          </div>
          <div className="space-x-7 mb-2">
            <label>Event Starting Date</label>
            <input
              value={new Date(this.state.eventStartingDate)
                .toISOString()
                .slice(0, 10)}
              min={this.state.participationCloseDate}
              onChange={(e) => {
                this.setState({
                  eventStartingDate: new Date(e.target.value).getTime(),
                });
              }}
              type="date"
            ></input>
          </div>
        </div>
        <div>
          <div className="flex w-full">
            <div className="w-full">
              <hr></hr>
              Markdown
              <hr></hr>
              <Markdown
                markdown={this.state.markdown}
                hidden={false}
                markdownOnChange={(md) => {
                  this.setState({ markdown: md });
                }}
              ></Markdown>
            </div>
            <div className="w-full">
              <hr></hr>
              Tournament Rules
              <hr></hr>
              <Markdown
                markdown={this.state.tournamentRules}
                hidden={false}
                markdownOnChange={(md) => {
                  this.setState({ tournamentRules: md });
                }}
              ></Markdown>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AdminTournament);
