const LastSwapped = ({ lastData }) => {
    return(
        <div className="lastData mt-5 w-100">
          <h5>Last Swapped</h5>
          <div className="content mt-3">
            <p className="text-muted">{lastData.walletAddress && lastData.walletAddress.replace(lastData.walletAddress.substring(4, 38), '-xxx-')}</p>
            {
              lastData.toDex && lastData.toDex ?
              <p className="text-muted"><i className="fa-brands fa-ethereum me-2"></i>{lastData.ethValue} <i class="fas fa-arrow-right"></i> <i className="fas fa-project-diagram me-2"></i>{lastData.dexValue}</p> :
              <p className="text-muted"><i className="fas fa-project-diagram me-2"></i>{lastData.dexValue} <i class="fas fa-arrow-right"></i> <i className="fa-brands fa-ethereum me-2"></i>{lastData.ethValue}</p>
            }
          </div>
        </div>
    )
}

export default LastSwapped