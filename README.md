# ThudJS
Attempt to create a Thud game in JS.
<h1>Game Rules</h1>
                <h3>Board Setup:</h3>
                <p class="ruleStyle">The octagonal playing area consists of a 15 by 15 square board from which a triangle of 15 squares in each corner has been removed. The Thudstone is placed on the centre square of the board, where it remains for the entire game and may not be moved onto or through. The eight trolls are placed onto the eight squares orthogonally and diagonally adjacent to the Thudstone and the thirty-two dwarfs are placed so as to occupy all the perimeter spaces except for the four in the same horizontal or vertical line as the Thudstone.</p>
            </div>
            <div id="divLegend">
                <h3 class="ruleStyle">Legend:</h3>
                <ul>
                    <li class="ruleStyle">
                        <span class="spanBold">D</span> stands for a Dwarf piece.
                    </li>
                    <li class="ruleStyle">
                        <span class="spanBold">T</span> stands for a Troll piece.
                    </li>
                    <li class="ruleStyle">
                        <span class="spanBold">S</span> stands for the Thudstone, it can't be moved by any player.
                    </li>
                </ul>
            </div>
            <div id="divGameStart">
                <h3 class="ruleStyle">Game Start:</h3>
                <p class="ruleStyle">One player takes control of the dwarfs, the other controls the trolls. The dwarfs move first.</p>
            </div>
            <div id="divControls">
                <h3 class="ruleStyle">Controls:</h3>
                <p class="ruleStyle">To select a Thud piece, click on it once and its background will be painted red of it is valid piece to move this turn. To move the piece click on a valid space that the piece would move to (the space will show an 'X' if the move is invalid). To deselect the piece click on it again.</p>
            </div>
            <div id="divDwarfTurnDesc">
                <h3 class="ruleStyle">Dwarf Actions:</h3>
                <p class="ruleStyle">On the dwarfs' turn, they may either move or hurl one dwarf:</p>
                <ul>
                    <li class="ruleStyle">
                        <span class="spanBold">Move:</span> any one dwarf is moved like a chess queen, any number of squares in any orthogonal or diagonal direction, but not onto or through any other piece, whether Thudstone, dwarf, or troll.
                    </li>
                    <li class="ruleStyle">
                        <span class="spanBold">Hurl:</span> anywhere there is a straight (orthogonal or diagonal) line of adjacent dwarfs on the board, they may hurl the front dwarf in the direction continuing the line, as long as the space between the lead dwarf and the troll is less than the number of dwarfs in the line. This is different from a normal move in that the dwarf is permitted to land on a square containing a troll, in which case the troll is removed from the board and the dwarf takes his place. This may only be done if the endmost dwarf can land on a troll by moving in the direction of the line at most as many spaces as there are dwarfs in the line. Since a single dwarf is a line of one in any direction, a dwarf may always move one space to capture a troll on an immediately adjacent square.
                    </li>
                </ul>
            </div>
            <div id="divTrollTurnDesc">
                <h3 class="ruleStyle">Troll Actions:</h3>
                <p class="ruleStyle">On the trolls' turn, they may either move or shove one troll:</p>
                <ul>
                    <li class="ruleStyle">
                        <span class="spanBold">Move:</span> one troll is moved like a chess king, one square in any orthogonal or diagonal direction onto an empty square. After the troll has been moved, any dwarfs on the eight squares adjacent to the moved troll will be immediately captured and removed from the board.
                    </li>
                    <li class="ruleStyle">
                        <span class="spanBold">Shove:</span> anywhere there is a straight (orthogonal or diagonal) line of adjacent trolls on the board, they may shove the endmost troll in the direction continuing the line, up to as many spaces as there are trolls in the line. As in a normal move, the troll may not land on an occupied square, and any dwarfs in the eight squares adjacent to its final position will immediately be captured. Trolls may only make a shove if by doing so they capture at least one dwarf.
                    </li>
                </ul>
            </div>
            <div id="divTurnEnd">
                <h3 class="ruleStyle">Turn End:</h3>
                <p class="ruleStyle">Once a player finishes their action their turn ends and the other player turn begins.</p>
            </div>
            <div id="divGameEndCondition">
                <h3 class="ruleStyle">Game End:</h3>
                <p class="ruleStyle">The battle is over when both players agree that no more captures can be made by continuing to play, or when one player has no more valid moves to make.</p>
            </div>
            <div id="divScoring">
                <h3 class="ruleStyle">Scoring:</h3>
                <p class="ruleStyle">The dwarfs score 1 point for each surviving dwarf, and the trolls score 4 for each remaining troll, with the difference being the 'final' score.</p>
